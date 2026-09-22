@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ==========================================
echo  Publicando FullCorpus AI (site) no GitHub
echo ==========================================
echo.

echo -- Buscando atualizacoes do GitHub...
git pull --no-edit

echo.
echo -- Enviando alteracoes...
git add .
git commit -m "Arquiva pagina Equipe (PT/EN); remove nome na Historia; hero com agilidade/quickly; corrige fonte do hero em EN" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push

echo.
echo ==========================================
echo  Pronto. O Netlify vai publicar em instantes.
echo ==========================================
pause
