import{d as p,at as f,G as a,a7 as m,c as o,V as i,w as _,h as g,n as x,Q as S,$ as b,C as h,k}from"./CtBPwxmq.js";import{r as z}from"./BPE46QSj.js";import"./76o_WpOd.js";const y=p({__name:"ButtonLink",props:{blank:{type:Boolean,required:!1,default:!1},color:f("primary"),href:{type:String,required:!0,default:""},icon:{type:String,default:""},size:{required:!1,type:[String,Object],default:"medium"},transparent:{required:!1,type:[Boolean,Object],default:!1}},setup(e){const s=a(()=>((t=n)=>`{color.${t.color}.600}`)()),r=a(()=>((t=n)=>`{color.${t.color}.500}`)()),n=e,l={size:{small:{padding:"{space.2} {space.4}",fontSize:"{text.sm.fontSize}",lineHeight:"{text.sm.lineHeight}"},medium:{padding:"{space.rem.625} {space.5}",fontSize:"{text.base.fontSize}",lineHeight:"{text.base.lineHeight}"},large:{padding:"{space.3} {space.6}",fontSize:"{text.lg.fontSize}",lineHeight:"{text.lg.lineHeight}"},giant:{padding:"{space.4} {space.8}",fontSize:"{text.lg.fontSize}",lineHeight:"{text.lg.lineHeight}"}},transparent:{true:{backgroundColor:"transparent"}}},{$pinceau:c}=m(n,l,{_YM9_buttonPrimary:s,_A23_buttonSecondary:r});return(t,H)=>{const u=b,d=h;return o(),i(d,{class:x(["button-link",[S(c)]]),to:e.href,target:e.blank?"_blank":void 0},{default:_(()=>[e.icon?(o(),i(u,{key:0,name:e.icon},null,8,["name"])):g("",!0),z(t.$slots,"default",{unwrap:"p ul li"},void 0,!0)]),_:3},8,["to","target","class"])}}}),q=k(y,[["__scopeId","data-v-b04d77eb"]]);export{q as default};
