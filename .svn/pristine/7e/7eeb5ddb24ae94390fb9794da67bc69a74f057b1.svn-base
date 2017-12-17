$startDir = $pwd.toString()

function rename-old-eclipse-projects()
{
    cd $startDir
    $eclipseProjectFiles = @(ls .project -r -path .)
    
    foreach ($file in $eclipseProjectFiles)
    {
        green $file.fullname
        cd (split-path $file.Fullname)
        mv -force .project old.project
        #mv -force .settings old.settings
    }
    
    cd $startDir
}

function mk-eclipse-project()
{
    cd $startDir
    $pomFiles = @(ls pom.xml -r -path .)
    foreach ($file in $pomFiles)
    {
        green $file.fullname
        cd (split-path $file.Fullname)
        mvn eclipse:eclipse 
    }
    cd $startDir
}

mk-eclipse-project
cd $startDir