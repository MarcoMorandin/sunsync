import{e as I,f as y,H as U,g as d,h as $,j as V,x as k,o as u,i as b,w as l,a as o,u as i,c as g,d as z,s as p,I as D,b as S,k as x}from"./index-c317085a.js";import{D as B,E,F as H,G as N,H as A,I as O}from"./mdi-9b0bf6d7.js";import{b as R,c as F}from"./SectionTitleLineWithButton-c1385c23.js";import{_ as P}from"./darkMode-8dbeebf5.js";import{_ as s,a as n}from"./FormControl-e78bb9bb.js";import{_ as h}from"./BaseButton-2fca0dd5.js";import{_ as T}from"./BaseButtons-b53453a8.js";import{_ as C}from"./LayoutAuthenticated-269f4650.js";import{_ as M}from"./NotificationBarInCard-0f285b47.js";const j={key:0},G=S("b",{class:"capitalize"},"ERRORE: ",-1),W={key:1},ae={__name:"NewPvView",setup(q){const m=I(),w=y(),e=U({pvLat:"",pvLong:"",pvHeight:"",pvDescription:"",power:"",pvUrl:"",wsId:""}),c=d([]);$(()=>{V.get("http://localhost:3000"+k,{headers:{Authorization:`Bearer ${m.getToken.value}`}}).then(_=>{_.data.forEach(t=>{c.value.push({id:t._id,label:t.description})})})});const L=async()=>{await V.post("http://localhost:3000"+x,{location:{lat:e.pvLat,long:e.pvLong,alt:e.pvHeight},description:e.pvDescription,url:e.pvUrl,installed_power:e.power,ws_id:e.wsId.id},{headers:{Authorization:`Bearer ${m.getToken.value}`}}).then(()=>{r.value=f[1],v.value=!1,setTimeout(()=>w.push("/dashboard"),500)}).catch(()=>{r.value=f[2]})},r=d(0),f=["none","success","danger"],v=d(!0);return(_,t)=>(u(),b(C,null,{default:l(()=>[o(F,null,{default:l(()=>[o(R,{icon:i(B),title:"Nuovo Impianto",main:""},null,8,["icon"]),o(M,{color:r.value},{default:l(()=>[r.value=="danger"?(u(),g("span",j,[G,z(" L'inserimento non è andato a buon fine!")])):p("",!0),r.value=="success"?(u(),g("span",W,"Inserimento avvenuto con successo!")):p("",!0)]),_:1},8,["color"]),v.value?(u(),b(P,{key:0,"is-form":"",onSubmit:D(L,["prevent"])},{footer:l(()=>[o(T,null,{default:l(()=>[o(h,{type:"submit",color:"info",label:"Invia"}),o(h,{type:"reset",color:"info",outline:"",label:"Reset"})]),_:1})]),default:l(()=>[o(s,{label:"Posizione Impianto Fotovoltaico"},{default:l(()=>[o(n,{modelValue:e.pvLat,"onUpdate:modelValue":t[0]||(t[0]=a=>e.pvLat=a),type:"number",icon:i(E),placeholder:"Latitudine"},null,8,["modelValue","icon"]),o(n,{modelValue:e.pvLong,"onUpdate:modelValue":t[1]||(t[1]=a=>e.pvLong=a),type:"number",icon:i(H),placeholder:"Longintudine"},null,8,["modelValue","icon"])]),_:1}),o(s,null,{default:l(()=>[o(n,{modelValue:e.pvHeight,"onUpdate:modelValue":t[2]||(t[2]=a=>e.pvHeight=a),type:"number",icon:i(N),placeholder:"Altitudine"},null,8,["modelValue","icon"])]),_:1}),o(s,{label:"Descrizione Impianto Fotovoltaico"},{default:l(()=>[o(n,{modelValue:e.pvDescription,"onUpdate:modelValue":t[3]||(t[3]=a=>e.pvDescription=a),type:"textarea",placeholder:"Descrizione dell'impianto fotovoltaico"},null,8,["modelValue"])]),_:1}),o(s,{label:"Potenza Installata (kW)"},{default:l(()=>[o(n,{modelValue:e.power,"onUpdate:modelValue":t[4]||(t[4]=a=>e.power=a),type:"number",icon:i(A)},null,8,["modelValue","icon"])]),_:1}),o(s,{label:"Url dati fotovoltaico"},{default:l(()=>[o(n,{modelValue:e.pvUrl,"onUpdate:modelValue":t[5]||(t[5]=a=>e.pvUrl=a),type:"url",icon:i(O)},null,8,["modelValue","icon"])]),_:1}),o(s,{label:"Stazione Meteo"},{default:l(()=>[o(n,{modelValue:e.wsId,"onUpdate:modelValue":t[6]||(t[6]=a=>e.wsId=a),options:c.value},null,8,["modelValue","options"])]),_:1})]),_:1},8,["onSubmit"])):p("",!0)]),_:1})]),_:1}))}};export{ae as default};
