import g from"./rVwFd5-C.js";import h from"./BJqmRn_l.js";import v from"./DeML5EUj.js";import{d as A,W as C,G as B,Q as r,c as n,e as i,f as o,i as l,F as L,X as V,g as e,w as d,q,Y as F,V as I,k as N}from"./CtBPwxmq.js";import{u as S}from"./BjEX_OTy.js";import"./DtA7NcZ1.js";const $={key:0,class:"articles-list"},P={class:"featured"},T={class:"layout"},Y={key:1,class:"tour"},b=A({__name:"ArticlesList",props:{path:{type:String,default:"articles"}},async setup(m){let s,c;const p=m,{data:f}=([s,c]=C(async()=>S(p.path,async()=>await q(F(p.path)).where({type:{$ne:"index"}}).sort({date:-1}).find(),"$KcqgFo39Mn")),s=await s,c(),s),a=B(()=>f.value||[]);return(D,t)=>{var _;const u=g,y=h,x=v;return(_=r(a))!=null&&_.length?(n(),i("div",$,[o("div",P,[l(u,{article:r(a)[0],featured:!0},null,8,["article"])]),o("div",T,[(n(!0),i(L,null,V(r(a).slice(1),(k,w)=>(n(),I(u,{key:w,article:k},null,8,["article"]))),128))])])):(n(),i("div",Y,[t[5]||(t[5]=o("p",null,"Seems like there are no articles yet.",-1)),o("p",null,[t[2]||(t[2]=e(" You can start by ")),l(y,{href:"https://alpine.nuxt.space/articles/write-articles"},{default:d(()=>t[0]||(t[0]=[e("creating")])),_:1}),t[3]||(t[3]=e(" one in the ")),l(x,null,{default:d(()=>t[1]||(t[1]=[e("articles")])),_:1}),t[4]||(t[4]=e(" folder. "))])]))}}}),X=N(b,[["__scopeId","data-v-3cf3a21f"]]);export{X as default};
