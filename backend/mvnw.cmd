@REM Maven Wrapper Script for Windows
@echo off

if defined JAVA_HOME (
  set JAVACMD=%JAVA_HOME%\bin\java.exe
) else (
  set JAVACMD=java.exe
)

set WRAPPER_JAR=%~dp0.mvn\wrapper\maven-wrapper.jar
set WRAPPER_PROPS=%~dp0.mvn\wrapper\maven-wrapper.properties

if not exist "%WRAPPER_JAR%" (
  for /f "tokens=2 delims==" %%i in ('findstr /i "wrapperUrl" "%WRAPPER_PROPS%"') do set WRAPPER_URL=%%i
  echo Downloading Maven Wrapper...
  powershell -Command "Invoke-WebRequest -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%'"
)

"%JAVACMD%" ^
  -classpath "%WRAPPER_JAR%" ^
  "-Dmaven.multiModuleProjectDirectory=%~dp0" ^
  org.apache.maven.wrapper.MavenWrapperMain ^
  %*
