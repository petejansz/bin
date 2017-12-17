function getUserAccount()
{
  return axios.get('/user/12345');
}

function getUserPermissions()
{
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms)
  {
    // Both requests are now complete
  }));