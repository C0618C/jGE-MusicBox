@echo off
cls
color 0e

title Step 1
echo 本文件用于初始化项目的工作环境


::生成git忽略提交的文件
(
    echo node_modules/
    echo package-lock.json
    echo .gitignore
) >> .gitignore




title Step 2
set packages= gulp  gulp-concat  gulp-uglify  uglify-es  del  opn

echo.
echo.
echo 将安装如下包到项目
echo %packages%

echo.
set /p isinitpackages=是否进行安装(y/n):
if "%isinitpackages%"=="n" (
    echo.
    echo 已跳过了安装
    echo.
) else ( 
    echo.
    echo 你选择了安装
    echo.
    echo.
    echo.
    npm install %packages%  | more
    echo.
    echo 安装完毕
    echo.
    color 0e
)





title Step 3
echo 环境构建完成，按任意键退出...

pause | echo.