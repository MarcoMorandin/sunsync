import{i as u}from"./mdi-9b0bf6d7.js";import{a as _,b as d,_ as i}from"./chart.config-e64abec1.js";import{c as f,b as h}from"./SectionTitleLineWithButton-080a5b51.js";import{_ as c}from"./darkMode-fc965fc0.js";import{_ as w}from"./LayoutAuthenticated-0c80f609.js";import{e as v,g as y,h as g,o as n,i as k,w as r,j as D,k as $,B as x,C as B,a as t,c as l,v as b,F as A,u as C}from"./index-67a10970.js";const L={__name:"ChartsView",setup(E){const m=v(),o=y([]),p=async()=>{let e=await D.get("https://sunsync-main-service.onrender.com"+$,{headers:{Authorization:`Bearer ${m.getToken.value}`}}).then(a=>a.data);for(let a in e)o.value.push({name:e[a].description+": "+e[a].installed_power/1e3+" kW",power:await _(["info","primary"],"https://sunsync-main-service.onrender.com"+x,"","",e[a]._id,["power","predicted_power"]),weather:await d(["warning","danger"],"https://sunsync-main-service.onrender.com"+B,"","",e[a].ws_id,["temperature","solar_power"])})};return g(async()=>{await p()}),(e,a)=>(n(),k(w,null,{default:r(()=>[t(f,null,{default:r(()=>[(n(!0),l(A,null,b(o.value,(s,S)=>(n(),l("div",null,[t(h,{icon:C(u),title:s.name,main:""},null,8,["icon","title"]),t(c,{class:"mb-6"},{default:r(()=>[t(i,{data:s.power,type:"pv",class:"h-72"},null,8,["data"])]),_:2},1024),t(c,{class:"mb-6"},{default:r(()=>[t(i,{data:s.weather,type:"ws",class:"h-72"},null,8,["data"])]),_:2},1024)]))),256))]),_:1})]),_:1}))}};export{L as default};
