import accessEnum from "./accessEnum";
const checkAccess = (loginUser: any, access = accessEnum.NOT_LOGIN) => {
    const loginUserRole = loginUser?.userRole ?? accessEnum.NOT_LOGIN;
    // 如果页面不需要权限，直接放行
    if (access === accessEnum.NOT_LOGIN) {
        return true;
    }
    // 如果页面需要的权限为user,但是用户没有登录，拒绝
    if (access === accessEnum.USER) {
        if (loginUserRole === accessEnum.NOT_LOGIN) {
            return false;
        }
    }
    // 如果页面需要的权限为admin，但是用户不是admin，拒绝
    if (access === accessEnum.ADMIN) {
        if (loginUserRole !== accessEnum.ADMIN) {
            return false;
        }
    }
    return true;
};
export default checkAccess;