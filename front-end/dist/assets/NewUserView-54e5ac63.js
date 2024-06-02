import{l as v,o as i,c as p,L as $,M as k,b,t as C,n as h,F as N,v as B,i as w,f as U,e as R,H as A,g,w as o,a as t,u as y,I as E,d as O,s as x,j as F,N as T}from"./index-bd6cc2fe.js";import{x as z,t as D,y as j,z as q}from"./mdi-9b0bf6d7.js";import{b as I,c as L}from"./SectionTitleLineWithButton-b598e757.js";import{_ as M}from"./darkMode-d9a8e29e.js";import{_,a as V}from"./FormControl-c71bfaa8.js";import{_ as S}from"./BaseButton-4bae2fa9.js";import{_ as P}from"./BaseButtons-da94e1a5.js";import{_ as H}from"./LayoutAuthenticated-2cfa592e.js";import{_ as G}from"./NotificationBarInCard-d80438ea.js";const W=["type","name","value"],J=b("span",{class:"check"},null,-1),K={class:"pl-2"},Q={__name:"FormCheckRadio",props:{name:{type:String,required:!0},type:{type:String,default:"checkbox",validator:e=>["checkbox","radio","switch"].includes(e)},label:{type:String,default:null},modelValue:{type:[Array,String,Number,Boolean],default:null},inputValue:{type:[String,Number,Boolean],required:!0}},emits:["update:modelValue"],setup(e,{emit:c}){const m=e,s=v({get:()=>m.modelValue,set:u=>{c("update:modelValue",u)}}),a=v(()=>m.type==="radio"?"radio":"checkbox");return(u,d)=>(i(),p("label",{class:h(e.type)},[$(b("input",{"onUpdate:modelValue":d[0]||(d[0]=l=>s.value=l),type:a.value,name:e.name,value:e.inputValue},null,8,W),[[k,s.value]]),J,b("span",K,C(e.label),1)],2))}},X={__name:"FormCheckRadioGroup",props:{options:{type:Object,default:()=>{}},name:{type:String,required:!0},type:{type:String,default:"checkbox",validator:e=>["checkbox","radio","switch"].includes(e)},componentClass:{type:String,default:null},isColumn:Boolean,modelValue:{type:[Array,String,Number,Boolean],default:null}},emits:["update:modelValue"],setup(e,{emit:c}){const m=e,s=v({get:()=>m.modelValue,set:a=>{c("update:modelValue",a)}});return(a,u)=>(i(),p("div",{class:h(["flex justify-start flex-wrap -mb-3",{"flex-col":e.isColumn}])},[(i(!0),p(N,null,B(e.options,(d,l)=>(i(),w(Q,{key:l,modelValue:s.value,"onUpdate:modelValue":u[0]||(u[0]=f=>s.value=f),type:e.type,name:e.name,"input-value":l,label:d,class:h([e.componentClass,"mr-6 mb-3 last:mr-0"])},null,8,["modelValue","type","name","input-value","label","class"]))),128))],2))}},Y={key:0},Z=b("b",{class:"capitalize"},"ERRORE: ",-1),ee={key:1},de={__name:"NewUserView",setup(e){const c=U(),m=R(),s={0:"Admin",1:"Dipendente"},a=A({username:"",email:"",pass:"",role:s[0]}),u=async()=>{console.log(),await F.post("https://sunsync-main-service.onrender.com:3000/"+T,{username:a.username,mail:a.email,password:a.pass,role:a.role},{headers:{Authorization:`Bearer ${m.getToken.value}`}}).then(()=>{l.value=f[1],setTimeout(()=>c.push("/dashboard"),500)}).catch(()=>{l.value=f[2]})},d=g(!0),l=g(0),f=["none","success","danger"];return(ae,n)=>(i(),w(H,null,{default:o(()=>[t(L,null,{default:o(()=>[t(I,{icon:y(z),title:"Nuovo Utente",main:""},null,8,["icon"]),t(M,{"is-form":"",onSubmit:E(u,["prevent"])},{footer:o(()=>[t(P,null,{default:o(()=>[t(S,{type:"submit",color:"info",label:"Invia"}),t(S,{type:"reset",color:"info",outline:"",label:"Reset"})]),_:1})]),default:o(()=>[t(G,{color:l.value,"is-placed-with-header":d.value},{default:o(()=>[l.value=="danger"?(i(),p("span",Y,[Z,O(" L'inserimento non è andato a buon fine!")])):x("",!0),l.value=="success"?(i(),p("span",ee,"Inserimento avvenuto con successo!")):x("",!0)]),_:1},8,["color","is-placed-with-header"]),t(_,{label:"Username"},{default:o(()=>[t(V,{modelValue:a.username,"onUpdate:modelValue":n[0]||(n[0]=r=>a.username=r),icon:y(D)},null,8,["modelValue","icon"])]),_:1}),t(_,{label:"Email"},{default:o(()=>[t(V,{modelValue:a.email,"onUpdate:modelValue":n[1]||(n[1]=r=>a.email=r),type:"email",icon:y(j)},null,8,["modelValue","icon"])]),_:1}),t(_,{label:"Password"},{default:o(()=>[t(V,{modelValue:a.pass,"onUpdate:modelValue":n[2]||(n[2]=r=>a.pass=r),type:"password",icon:y(q)},null,8,["modelValue","icon"])]),_:1}),t(_,{label:"Ruolo"},{default:o(()=>[t(X,{modelValue:a.role,"onUpdate:modelValue":n[3]||(n[3]=r=>a.role=r),name:"role",type:"radio",options:s},null,8,["modelValue"])]),_:1})]),_:1},8,["onSubmit"])]),_:1})]),_:1}))}};export{de as default};
