import{k as p}from"./endpoints-a97983b3.js";import{a as h,c as _,b as g}from"./darkMode-d4261cad.js";import{_ as k}from"./BaseLevel-3be95c65.js";import{_ as y}from"./BaseButton-34cb38d9.js";import{j as l,g as B,B as w,o,c as x,a as v,w as C,b as r,i as n,l as c,r as i,u as b,n as S}from"./index-8b5b05ee.js";const $={class:"flex flex-col md:flex-row items-center"},N={class:"text-center md:text-left md:py-2"},L={__name:"NotificationBar",props:{icon:{type:String,default:null},outline:Boolean,color:{type:String,required:!0}},setup(e){const s=e,m=l(()=>s.outline?_[s.color]:g[s.color]),t=B(!1),u=()=>{t.value=!0},d=w(),f=l(()=>d.right);return(a,V)=>t.value?c("",!0):(o(),x("div",{key:0,class:S([m.value,"px-3 py-6 md:py-3 mb-6 last:mb-0 border rounded-lg transition-colors duration-150"])},[v(k,null,{default:C(()=>[r("div",$,[e.icon?(o(),n(h,{key:0,path:e.icon,w:"w-10 md:w-5",h:"h-10 md:h-5",size:"24",class:"md:mr-2"},null,8,["path"])):c("",!0),r("span",N,[i(a.$slots,"default")])]),f.value?i(a.$slots,"right",{key:0}):(o(),n(y,{key:1,icon:b(p),small:"","rounded-full":"",color:"white",onClick:u},null,8,["icon"]))]),_:3})],2))}};export{L as _};