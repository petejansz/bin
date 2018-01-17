$srctag = "https://156.24.30.205/svn/gga-src/pd-sites/tags/cpd_all_2_0_15_14"
$newbranch = "https://156.24.30.205/svn/gga-src/pd-sites/branches/cpd_all_2_0_15_15_branch"
$msg = "Dev branch to fix CASA-10694 - Search results in Player Direct Admin Screen time out and don't give results."
svn cp $srctag $newbranch -m $msg
