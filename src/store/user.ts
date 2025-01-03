import { StoreOptions } from "vuex";
import accessEnum from "@/access/accessEnum";
import { UserControllerService } from "../../generated";
export default ({
namespaced: true,
  state: {
    loginUser: {
        userName: "未登录",
    }
  },
  getters: {},
  mutations: {
    updateUser(state, payload) {
        state.loginUser=payload
    },
  },
//   执行异步操作，调用mutations
  actions: {
    async getLoginUser({ commit,state }, payload) {
       const response=await UserControllerService.getLoginUserUsingGet();
       if(response.code==0){
        commit("updateUser",response.data)
       }else{
        commit("updateUser",{...state.loginUser,userRole:accessEnum.NOT_LOGIN})
       }
    },
  },
  modules: {},
}) as StoreOptions<any>;