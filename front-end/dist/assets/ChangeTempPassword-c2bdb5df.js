import{g as V,e as P,H as g,f as k,o as p,i as m,w as s,a,n as y,I as R,u as t,d as c,s as $,b as N,j as B,K as C}from"./index-bd6cc2fe.js";import{v as E,u as i}from"./mdi-9b0bf6d7.js";import{L as x,_ as L}from"./LayoutGuest-3b34abdc.js";import{_ as S}from"./darkMode-d9a8e29e.js";import{_ as d,a as u}from"./FormControl-c71bfaa8.js";import{_ as f}from"./BaseButton-4bae2fa9.js";import{_ as A}from"./BaseButtons-da94e1a5.js";import{_}from"./NotificationBar-eeedb93f.js";import"./BaseLevel-744005ac.js";const I=N("b",null,"ERRORE: ",-1),O={__name:"ChangeTempPassword",setup(T){const l=V(!1),w=P(),e=g({login:"",pass:"",oldPass:"",repeatPass:""}),h=k(),v=async()=>{e.pass===e.repeatPass?B.patch("https://sunsync-main-service.onrender.com:3000/"+C,{old_password:e.oldPass,password:e.pass},{headers:{Authorization:`Bearer ${w.getToken.value}`}}).then(()=>{h.push("/dashboard")}).catch(n=>{l.value=!0,error.value=n.response.data["400 Bad Request"]}):(l.value=!0,error.value="Le password non coincidono")};return(n,o)=>(p(),m(x,null,{default:s(()=>[a(L,{bg:"purplePink"},{default:s(({cardClass:b})=>[a(S,{class:y(b),"is-form":"",onSubmit:R(v,["prevent"])},{footer:s(()=>[a(A,null,{default:s(()=>[a(f,{type:"submit",color:"info",label:"Change password"}),a(f,{to:"/login",color:"info",outline:"",label:"Back"})]),_:1})]),default:s(()=>[a(_,{color:"info",icon:t(E)},{default:s(()=>[c(" Devi cambiare la password che ti è stata assegnata ")]),_:1},8,["icon"]),l.value?(p(),m(_,{key:0,color:"danger",icon:n.mdiMonitorCellphone},{default:s(()=>[I,c(" Errore nell'effettuare il cambio della password ")]),_:1},8,["icon"])):$("",!0),a(d,{label:"Vecchia Password",help:"Inserisci la tua vecchia password"},{default:s(()=>[a(u,{modelValue:e.oldPass,"onUpdate:modelValue":o[0]||(o[0]=r=>e.oldPass=r),icon:t(i),type:"password",name:"old_password",autocomplete:"old-password"},null,8,["modelValue","icon"])]),_:1}),a(d,{label:"Nuova Password",help:"Inserisci la tua nuova password"},{default:s(()=>[a(u,{modelValue:e.pass,"onUpdate:modelValue":o[1]||(o[1]=r=>e.pass=r),icon:t(i),type:"password",name:"password",autocomplete:"new-password"},null,8,["modelValue","icon"])]),_:1}),a(d,{label:"Ripeti Nuova Password",help:"Ripeti la tua nuova password"},{default:s(()=>[a(u,{modelValue:e.repeatPass,"onUpdate:modelValue":o[2]||(o[2]=r=>e.repeatPass=r),icon:t(i),type:"password",name:"password_confirmation",autocomplete:"new-password"},null,8,["modelValue","icon"])]),_:1})]),_:2},1032,["class","onSubmit"])]),_:1})]),_:1}))}};export{O as default};
