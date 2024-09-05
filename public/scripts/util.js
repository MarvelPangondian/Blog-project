const isCurrentRoute = (route, currentRoute) => {
  return route === currentRoute ? 'is-active' : '';
}

module.exports = isCurrentRoute;