@echo off
cls
color 0e

title Step 1
echo ���ļ����ڳ�ʼ����Ŀ�Ĺ�������


::����git�����ύ���ļ�
(
    echo node_modules/
    echo package-lock.json
    echo .gitignore
) >> .gitignore




title Step 2
set packages= gulp  gulp-concat  gulp-uglify  uglify-es  del  opn

echo.
echo.
echo ����װ���°�����Ŀ
echo %packages%

echo.
set /p isinitpackages=�Ƿ���а�װ(y/n):
if "%isinitpackages%"=="n" (
    echo.
    echo �������˰�װ
    echo.
) else ( 
    echo.
    echo ��ѡ���˰�װ
    echo.
    echo.
    echo.
    npm install %packages%  | more
    echo.
    echo ��װ���
    echo.
    color 0e
)





title Step 3
echo ����������ɣ���������˳�...

pause | echo.