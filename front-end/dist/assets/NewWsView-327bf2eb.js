import{e as v,f as L,H as h,g as f,o as r,i as p,w as a,a as o,u as l,c as _,d as y,s as m,I as S,b as U,j as $,x as z}from"./index-67a10970.js";import{D,E as k,F as x,G as H,I}from"./mdi-9b0bf6d7.js";import{b as N,c as B}from"./SectionTitleLineWithButton-080a5b51.js";import{_ as E}from"./darkMode-fc965fc0.js";import{_ as u,a as i}from"./FormControl-25dd1248.js";import{_ as w}from"./BaseButton-4f5af7b8.js";import{_ as R}from"./BaseButtons-dc8cc76b.js";import{_ as A}from"./LayoutAuthenticated-0c80f609.js";import{_ as M}from"./NotificationBarInCard-3b17e8ff.js";const O={key:0},C=U("b",{class:"capitalize"},"ERRORE: ",-1),T={key:1},Z={__name:"NewWsView",setup(F){const V=v(),b=L(),e=h({wsLat:"",wsLong:"",wsHeight:"",wsDescription:"",wsUrl:""}),g=async()=>{await $.post("https://sunsync-main-service.onrender.com"+z,{location:{lat:e.wsLat,long:e.wsLong,alt:e.wsHeight},description:e.wsDescription,url:e.wsUrl},{headers:{Authorization:`Bearer ${V.getToken.value}`}}).then(async()=>{n.value=d[1],c.value=!1,setTimeout(()=>b.push("/dashboard"),500)}).catch(()=>{n.value=d[2]})},n=f(0),d=["none","success","danger"],c=f(!0);return(P,t)=>(r(),p(A,null,{default:a(()=>[o(B,null,{default:a(()=>[o(N,{icon:l(D),title:"Nuova Stazione Meteo",main:""},null,8,["icon"]),o(M,{color:n.value},{default:a(()=>[n.value=="danger"?(r(),_("span",O,[C,y(" L'inserimento non è andato a buon fine!")])):m("",!0),n.value=="success"?(r(),_("span",T,"Inserimento avvenuto con successo!")):m("",!0)]),_:1},8,["color"]),c.value?(r(),p(E,{key:0,"is-form":"",onSubmit:S(g,["prevent"])},{footer:a(()=>[o(R,null,{default:a(()=>[o(w,{type:"submit",color:"info",label:"Invia"}),o(w,{type:"reset",color:"info",outline:"",label:"Reset"})]),_:1})]),default:a(()=>[o(u,{label:"Posizione Stazione Meteo"},{default:a(()=>[o(i,{modelValue:e.wsLat,"onUpdate:modelValue":t[0]||(t[0]=s=>e.wsLat=s),type:"number",icon:l(k),placeholder:"Latitudine"},null,8,["modelValue","icon"]),o(i,{modelValue:e.wsLong,"onUpdate:modelValue":t[1]||(t[1]=s=>e.wsLong=s),type:"number",icon:l(x),placeholder:"Longintudine"},null,8,["modelValue","icon"])]),_:1}),o(u,null,{default:a(()=>[o(i,{modelValue:e.wsHeight,"onUpdate:modelValue":t[2]||(t[2]=s=>e.wsHeight=s),type:"number",icon:l(H),placeholder:"Altitudine"},null,8,["modelValue","icon"])]),_:1}),o(u,{label:"Descrizione Stazione Meteo"},{default:a(()=>[o(i,{modelValue:e.wsDescription,"onUpdate:modelValue":t[3]||(t[3]=s=>e.wsDescription=s),type:"textarea",placeholder:"Descrizione della stazione meteo"},null,8,["modelValue"])]),_:1}),o(u,{label:"Url dati meteo"},{default:a(()=>[o(i,{modelValue:e.wsUrl,"onUpdate:modelValue":t[4]||(t[4]=s=>e.wsUrl=s),type:"url",icon:l(I)},null,8,["modelValue","icon"])]),_:1})]),_:1},8,["onSubmit"])):m("",!0)]),_:1})]),_:1}))}};export{Z as default};