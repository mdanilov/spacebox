call cordova create finder ru.gofinder.app Finder
cd finder
call cordova platform add android
call cordova plugin add org.apache.cordova.console org.apache.cordova.device org.apache.cordova.inappbrowser org.apache.cordova.geolocation
cd ..
cd ..
node ..\node_modules\gulp\bin\gulp build
node ..\node_modules\gulp\bin\gulp cordova
mkdir tools\finder\www\fonts
xcopy lib\components-font-awesome\fonts tools\finder\www\fonts /s /e /y
copy dist\angular.js tools\finder\www\js
copy dist\spacebox-bundle.js tools\finder\www\js
copy dist\spacebox-bundle.css tools\finder\www\css
copy dist\yepnope.1.5.0-min.js tools\finder\www\js
rem copy src\js\main.js tools\finder\www\js
rem copy index.html tools\finder\www\
mkdir tools\finder\www\src\js\app\templates
xcopy src\js\app\templates tools\finder\www\src\js\app\templates /s /e /y
mkdir tools\finder\www\src\img
xcopy src\img tools\finder\www\src\img /s /e /y
cd tools\finder
cordova run android
rem com.ionic.keyboard