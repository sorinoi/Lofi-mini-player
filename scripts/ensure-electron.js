const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getPlatformPath() {
  switch (process.platform) {
    case 'darwin':
      return 'Electron.app/Contents/MacOS/Electron';
    case 'linux':
      return 'electron';
    case 'win32':
      return 'electron.exe';
    default:
      return 'electron';
  }
}

function checkElectron() {
  try {
    const electron = require('electron');
    if (typeof electron === 'string' && fs.existsSync(electron)) {
      return true;
    }
  } catch (e) {
    // not valid
  }
  return false;
}

async function main() {
  if (checkElectron()) {
    console.log('[ensure-electron] Electron binary is verified and ready.');
    return;
  }

  console.log('[ensure-electron] Electron binary missing or incomplete. Auto-repairing...');
  const electronDir = path.resolve(__dirname, '../node_modules/electron');
  if (!fs.existsSync(electronDir)) {
    console.warn('[ensure-electron] node_modules/electron directory does not exist.');
    return;
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(electronDir, 'package.json'), 'utf8'));
  const version = pkg.version;
  const platform = process.platform;
  const arch = process.arch;
  const platformBinary = getPlatformPath();
  const distDir = path.join(electronDir, 'dist');

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  try {
    const { downloadArtifact } = require('@electron/get');
    console.log(`[ensure-electron] Resolving cached/downloaded Electron v${version} (${platform}-${arch})...`);
    const zipPath = await downloadArtifact({
      version,
      artifactName: 'electron',
      platform,
      arch
    });
    console.log(`[ensure-electron] Using artifact: ${zipPath}`);

    // Attempt extraction via tar / unzip / powershell first (handles file locks / node stream quirks better)
    let extracted = false;
    if (platform === 'win32') {
      try {
        console.log('[ensure-electron] Extracting via tar...');
        execSync(`tar -xf "${zipPath}" -C "${distDir}"`, { stdio: 'ignore' });
        extracted = true;
      } catch {
        try {
          console.log('[ensure-electron] Tar failed, extracting via PowerShell Expand-Archive...');
          execSync(`powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${distDir}' -Force"`, { stdio: 'ignore' });
          extracted = true;
        } catch (e) {
          console.warn('[ensure-electron] PowerShell extraction failed:', e.message);
        }
      }
    } else {
      try {
        execSync(`unzip -q -o "${zipPath}" -d "${distDir}"`, { stdio: 'ignore' });
        extracted = true;
      } catch {
        try {
          execSync(`tar -xf "${zipPath}" -C "${distDir}"`, { stdio: 'ignore' });
          extracted = true;
        } catch (e) {
          console.warn('[ensure-electron] Native unzipper failed:', e.message);
        }
      }
    }

    if (!extracted) {
      console.log('[ensure-electron] Using fallback JS extract-zip...');
      const extract = require('extract-zip');
      await extract(zipPath, { dir: distDir });
    }

    // Write path.txt
    fs.writeFileSync(path.join(electronDir, 'path.txt'), platformBinary, 'utf8');

    // Move electron.d.ts if present
    const srcTypeDefPath = path.join(distDir, 'electron.d.ts');
    const targetTypeDefPath = path.join(electronDir, 'electron.d.ts');
    if (fs.existsSync(srcTypeDefPath)) {
      try {
        fs.renameSync(srcTypeDefPath, targetTypeDefPath);
      } catch {}
    }

    if (checkElectron()) {
      console.log('[ensure-electron] Successfully repaired and verified Electron binary!');
    } else {
      console.error('[ensure-electron] Repair completed but binary could not be verified.');
    }
  } catch (err) {
    console.error('[ensure-electron] Error while repairing Electron:', err);
  }
}

main().catch(err => {
  console.error('[ensure-electron] Unexpected failure:', err);
});
