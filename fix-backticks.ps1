# Read the file content
$content = Get-Content 'modules\web-elevate\src\data\debugChallenges.ts' -Raw

# Fix escaped backticks
$content = $content -replace '\\`', '`'

# Fix escaped template literal syntax
$content = $content -replace '\\\$\{', '${'

# Write back to file
$content | Set-Content 'modules\web-elevate\src\data\debugChallenges.ts' -NoNewline
Write-Host "Applied basic syntax fixes"
