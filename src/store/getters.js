const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  username: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId
}
export default getters
