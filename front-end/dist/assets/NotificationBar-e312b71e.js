import{C as p}from"./mdi-9b0bf6d7.js";import{a as h,c as _,b as g}from"./darkMode-fc965fc0.js";import{_ as y}from"./BaseLevel-b45e7703.js";import{_ as k}from"./BaseButton-4f5af7b8.js";import{l,g as w,P as x,o,c as B,a as C,w as v,b as r,i as n,s as c,r as i,u as b,n as S}from"./index-67a10970.js";const $={class:"flex flex-col md:flex-row items-center"},N={class:"text-center md:text-left md:py-2"},O={__name:"NotificationBar",props:{icon:{type:String,default:null},outline:Boolean,color:{type:String,required:!0}},setup(s){const e=s,m=l(()=>e.outline?_[e.color]:g[e.color]),t=w(!1),u=()=>{t.value=!0},d=x(),f=l(()=>d.right);return(a,V)=>t.value?c("",!0):(o(),B("div",{key:0,class:S([m.value,"px-3 py-6 md:py-3 mb-6 last:mb-0 border rounded-lg transition-colors duration-150"])},[C(y,null,{default:v(()=>[r("div",$,[s.icon?(o(),n(h,{key:0,path:s.icon,w:"w-10 md:w-5",h:"h-10 md:h-5",size:"24",class:"md:mr-2"},null,8,["path"])):c("",!0),r("span",N,[i(a.$slots,"default")])]),f.value?i(a.$slots,"right",{key:0}):(o(),n(k,{key:1,icon:b(p),small:"","rounded-full":"",color:"white",onClick:u},null,8,["icon"]))]),_:3})],2))}};export{O as _};