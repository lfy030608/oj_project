import accessEnum from "./accessEnum";
const checkAccess = (loginUser: any, access = accessEnum.NOT_LOGIN) => {
    const loginUserRole = loginUser?.userRole ?? accessEnum.NOT_LOGIN;
    if (access === accessEnum.NOT_LOGIN) {
        return true;
    }
    if (access === accessEnum.USER) {
        if (loginUserRole === accessEnum.NOT_LOGIN) {
            return false;
        }
    }
    if (access === accessEnum.ADMIN) {
        if (loginUserRole !== accessEnum.ADMIN) {
            return false;
        }
    }
    return true;
};
export default checkAccess;