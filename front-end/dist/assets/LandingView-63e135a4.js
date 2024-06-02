import{m as f,a as E,b as L,c as D,d as C,e as N,f as $,g as v,h as S,i as A}from"./mdi-9b0bf6d7.js";import{_ as T,a as B,b as d,c as P}from"./SectionTitleLineWithButton-080a5b51.js";import{_ as m}from"./CardBoxWidget-8c515c09.js";import{o as h,c as w,a as e,w as i,b as n,t as R,u as s,d as V,e as z,f as O,n as p,r as j,g,h as F,i as I,j as b,p as U,m as W}from"./index-67a10970.js";import{u as q,_ as y}from"./darkMode-fc965fc0.js";import{_ as H}from"./BaseLevel-b45e7703.js";import{c as k,_ as M}from"./chart.config-e64abec1.js";import"./PillTag-c69ca604.js";import"./BaseButton-4f5af7b8.js";const K="/logoOrizzontale.png",Y=[{isCurrentUser:!0,menu:[{icon:f,label:"Dashboard",to:"/dashboard"},{icon:E,label:"Impostazioni",to:"/profile"}],isAuth:!0,bgColor:"dark:bg-slate-800 bg-slate-900"},{icon:f,label:"Dashboard",isDesktopNoLabel:!0,isAuth:!0,to:"/dashboard",bgColor:"dark:bg-slate-800 bg-slate-900"},{icon:L,label:"Light/Dark",isDesktopNoLabel:!0,isToggleLightDark:!0,bgColor:"dark:bg-slate-800 bg-slate-900"},{icon:D,label:"Logout",to:"/logout",isDesktopNoLabel:!0,isLogout:!0,isAuth:!0,bgColor:"dark:bg-slate-800 bg-slate-900"},{icon:C,label:"Login",to:"/login",isAuth:!1,bgColor:"dark:bg-slate-800 bg-slate-900"}],G={class:"justify-center text-center flex h-20 dark:bg-slate-800 bg-slate-900 text-slate-300"},J={class:""},Q={__name:"FooterBar",setup(_){const a=new Date().getFullYear();return(t,c)=>(h(),w("footer",G,[e(H,null,{default:i(()=>[n("div",J,[n("p",null,[n("strong",null,R(s(a))+" Made by Morandin Marco & Soldera Marco",1),V(" for University of Trento ")])])]),_:1})]))}},X=n("div",{class:"justify-center items-center text-center flex pt-6 pl-4"},[n("img",{src:K,alt:"",class:"h-10"})],-1),Z={__name:"LayoutHome",setup(_){const a=z(),t=q(),c=O(),u=(o,r)=>{r.isToggleLightDark&&t.set(),r.isLogout&&(a.setToken(""),a.setExpire(""),a.setUserId(""),a.setRole(""),c.push({name:"home"}),location.reload())};return(o,r)=>(h(),w("div",{class:p({"overflow-hidden lg:overflow-visible":o.isAsideMobileExpanded})},[n("div",{class:p([[o.layoutAsidePadding,{"ml-60 lg:ml-0":o.isAsideMobileExpanded}],"pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"])},[e(B,{menu:s(Y),"is-home":!0,class:p([[o.layoutAsidePadding,{"ml-60 lg:ml-0":o.isAsideMobileExpanded}],"bg-slate-900 h-20"]),onMenuClick:u},{default:i(()=>[e(T,{"use-margin":""},{default:i(()=>[X]),_:1})]),_:1},8,["menu","class"]),j(o.$slots,"default"),e(Q)],2)],2))}},ee={class:"grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6"},de={__name:"LandingView",setup(_){const a=g(""),t=g({pvNumber:0,money:0}),c=()=>{b.get("https://sunsync-main-service.onrender.com/api/v1/reports/pvnumber",{}).then(l=>{t.value.pvNumber=l.data.number_of_pv_systems}).catch(()=>{showErrorNotification.value=!0,a.value="Errore nel caricamento del numero di impianti registrati"})},u=()=>{b.get("https://sunsync-main-service.onrender.com/api/v1/reports/money",{params:{aggregation:"all"}}).then(l=>{t.value.money=Math.floor(l.data[0].total)}).catch(()=>{showErrorNotification.value=!0,a.value="Errore nel caricamento del valore dei soldi risparmiati"})},o=()=>{b.get("https://sunsync-main-service.onrender.com/api/v1/reports/production",{params:{aggregation:"all"}}).then(l=>{t.value.production=Math.floor(l.data[0].total/1e3)}).catch(()=>{showErrorNotification.value=!0,a.value="Errore nel caricamento del valore della quantità di energia prodotta"})},r=g({}),x=async()=>{r.value.production=await k("info","https://sunsync-main-service.onrender.com"+U,"","","","total","Energy (Wh)"),r.value.money=await k("primary","https://sunsync-main-service.onrender.com"+W,"","","","total","Money (€)")};return F(async()=>{c(),u(),o(),await x()}),(l,ae)=>(h(),I(Z,null,{default:i(()=>[e(P,null,{default:i(()=>[e(d,{icon:s(N),title:"Overview",main:"",class:"mt-6"},null,8,["icon"]),n("div",ee,[e(m,{trend:"","trend-type":"up",color:"text-blue-500",icon:s($),number:t.value.pvNumber,label:"Impianti Fotovoltaici"},null,8,["icon","number"]),e(m,{trend:"","trend-type":"up",color:"text-emerald-500",icon:s(v),number:t.value.money,prefix:"€ ",label:"Soldi Risparmiati"},null,8,["icon","number"]),e(m,{trend:"","trend-type":"up",color:"text-orange-300",icon:s(S),number:t.value.production,suffix:" KW/h",label:"Energia Prodotta"},null,8,["icon","number"])]),e(d,{icon:s(A),title:"Produzione Energetica",main:"",class:"mt-4"},null,8,["icon"]),e(y,{class:"mb-6"},{default:i(()=>[e(M,{data:r.value.production,class:"h-72"},null,8,["data"])]),_:1}),e(d,{icon:s(v),title:"Soldi Risparmiati",main:"",class:"mt-4"},null,8,["icon"]),e(y,{class:"mb-6"},{default:i(()=>[e(M,{data:r.value.money,class:"h-72"},null,8,["data"])]),_:1})]),_:1})]),_:1}))}};export{de as default};