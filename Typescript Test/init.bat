echo off
setlocal

:startup
	
	cls

	echo Select program
	echo 1 = check
	echo 2 = install modules
	echo 3 = run program
	echo 4 (or anything else) = exit
	echo --------------------------

	set /p command=

	if %command%==1 goto checkfile
	if %command%==2 goto install_modules
	if %command%==3 goto run_program
	if %command%==4 exit
	
	exit /b 0


:run_program

	%@Try%
	
		echo Executing program...

		npm run init

	%@EndTry%
	:@Catch

		echo Failed to run npm command. NodeJS may not be installed.

	:@EndCatch

	goto startup

:install_modules 

	%@Try%
		
		if not exist package.json (

			echo package.json file has not been found.

			goto startup
		)

		echo Installing dependecies... It may take a little while, the program will exist if everything got installed succesfully. Combine CTRL + R to stop the installation process.

		node -v

		npm run install

		echo Modules succesfully has been installed.
	%@EndTry%
	:@Catch
	
		echo Failed to run npm command. NodeJS may not be installed.
			
	:@EndCatch


	goto startup

:checkfile
	:: Check if index file exiss.
	if not exist index.ts call :err_notfound index.ts

	:: Check if directory with files exist.
	if not exist modules\ call :err_notfound modules\

	:: Check if modules exists
	if not exist modules\commands call :err_notfound modules\commands
	if not exist modules\commands\help.ts call :err_notfound modules\commands\help.ts
	if not exist modules\commands\lyrics.ts call :err_notfound modules\commands\lyrics.ts
	if not exist modules\commands\nowplaying.ts call :err_notfound modules\commands\nowplaying.ts
	if not exist modules\commands\play.ts call :err_notfound modules\commands\play.ts
	if not exist modules\commands\queue.ts call :err_notfound modules\commands\queue.ts
	if not exist modules\commands\skip.ts call :err_notfound modules\commands\skip.ts
	if not exist modules\commands\tts.ts call :err_notfound modules\commands\tts.ts
	if not exist modules\commands\weather.ts call :err_notfound modules\commands\weather.ts
	if not exist modules\essentials call :err_notfound modules\essentials
	if not exist modules\essentials\canvas.ts call :err_notfound modules\essentials\canvas.ts

	:: Check for necessary files.
	if not exist .env call :err_envnotfound

	echo Files succesfully has been checked, you will return back to the start program after 4 seconds.

	timeout /t 4

	:: Exit function
	goto startup

:err_notfound

	echo File or directory %~1 not found

	exit /b 0

:err_envnotfound
	echo .env file has not been found.