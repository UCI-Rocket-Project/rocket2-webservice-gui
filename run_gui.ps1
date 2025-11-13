$DockerAppPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
$DockerAppProcessName = "Docker Desktop"

$ProjectDirectory = "C:\Users/John Rocket\rocket2-webservice-gui"

Write-Host "Checking if Docker Engine is running..."
$dockerProcessStatus = Get-Process -Name $DockerAppProcessName -ErrorAction SilentlyContinue

if ($dockerProcessStatus) {
    Write-Host "Docker Engine is already running!"
} else {
    Write-Host "Docker Engine is not already running... Launching."

    Start-Process -FilePath $DockerAppPath
    Write-Host "Waiting for engine to start (20s)..."
    Start-Sleep -Seconds 20
    Write-Host "Docker Engine is ready!"
}

Write-Host "Launching GUI"

Start-Job -ScriptBlock {
    Start-Sleep -Seconds 5
    Start-Process "chrome.exe" "http://localhost:3000"
}

Set-Location -Path "C:\Users/John Rocket\rocket2-webservice-gui"
make run

Write-Host "

"
Read-Host -Prompt "Press any key to exit"