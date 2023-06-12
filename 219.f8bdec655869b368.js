"use strict";(self.webpackChunkAdamRoldan=self.webpackChunkAdamRoldan||[]).push([[219],{219:(U,m,o)=>{o.r(m),o.d(m,{ContactModule:()=>i});var p=o(6895),u=o(6962),a=o(4006),f=o(5226),d=o.n(f),t=o(4650),h=o(4377),x=o(3071),c=o(4463),v=o(5139),Z=o(419),C=o(5227);function b(n,e){1&n&&(t.TgZ(0,"span",21),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&n&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"Name is required")," "))}function A(n,e){1&n&&(t.TgZ(0,"span",21),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&n&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"Please provide a valid e-mail")," "))}function y(n,e){1&n&&(t.TgZ(0,"span",21),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&n&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"Subject is required")," "))}function F(n,e){1&n&&(t.TgZ(0,"span",21),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&n&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"Message is required")," "))}class l{constructor(e,r,g,M,L){this.fb=e,this.authService=r,this.userService=g,this.translate=M,this.spinnerService=L,this.myForm=this.fb.group({name:["",[a.kI.required]],email:["",[a.kI.required,a.kI.email]],subject:["",[a.kI.required]],message:["",[a.kI.required]]}),this.translate.addLangs(["es","en"])}ngOnInit(){this.authService.isLoggedIn.subscribe({next:e=>{this.isLoggedIn=e}})}isValidField(e){return this.myForm.controls[e].errors&&this.myForm.controls[e].touched}save(){this.myForm.invalid?this.myForm.markAllAsTouched():(this.activeSpinner(!0),this.userService.contact(this.myForm.value.name,this.myForm.value.email,this.myForm.value.subject,this.myForm.value.message).subscribe({next:e=>{this.activeSpinner(!1),d().fire({icon:"success",title:"Your message was sent",text:"You will receive an answer soon"}),this.myForm.reset()},error:e=>{this.activeSpinner(!1),d().fire({icon:"error",title:"Oops...",text:"Something went wrong!"}),console.log(e)}}))}activeSpinner(e){this.spinnerService.spinnerSubject.next(e)}}l.\u0275fac=function(e){return new(e||l)(t.Y36(a.qu),t.Y36(h.e),t.Y36(x.K),t.Y36(c.sK),t.Y36(v.V))},l.\u0275cmp=t.Xpm({type:l,selectors:[["app-contact"]],decls:46,vars:35,consts:[[1,"frontPage"],[1,"title"],[1,"container"],["method","POST","id","contactForm","name","contactForm","autocomplete","off",1,"contactForm",3,"formGroup","ngSubmit"],[1,"row"],[1,"col-md-6","box"],[1,"form-group"],["for","name",1,"label"],["type","text","formControlName","name",1,"form-control",3,"placeholder"],["class","form-text text-danger",4,"ngIf"],["for","email",1,"label"],["type","email","formControlName","email",1,"form-control",3,"placeholder"],[1,"col-md-12","box"],["for","subject",1,"label"],["type","text","formControlName","subject",1,"form-control",3,"placeholder"],["for","#",1,"label"],["name","message","formControlName","message","cols","30","rows","4",1,"form-control",3,"placeholder"],[1,"col-md-12","buttons"],[1,"form-group","groupButtons"],["type","submit",1,"btn","btn-success","button",3,"value"],[1,"submitting"],[1,"form-text","text-danger"]],template:function(e,r){1&e&&(t.TgZ(0,"div",0)(1,"h1",1),t._uU(2),t.ALo(3,"translate"),t.qZA()(),t.TgZ(4,"div",2),t._UZ(5,"app-breadcrumb"),t.TgZ(6,"form",3),t.NdJ("ngSubmit",function(){return r.save()}),t.TgZ(7,"div",4)(8,"div",5)(9,"div",6)(10,"label",7),t._uU(11),t.ALo(12,"translate"),t.qZA(),t._UZ(13,"input",8),t.ALo(14,"translate"),t.YNc(15,b,3,3,"span",9),t.qZA()(),t.TgZ(16,"div",5)(17,"div",6)(18,"label",10),t._uU(19),t.ALo(20,"translate"),t.qZA(),t._UZ(21,"input",11),t.ALo(22,"translate"),t.YNc(23,A,3,3,"span",9),t.qZA()(),t.TgZ(24,"div",12)(25,"div",6)(26,"label",13),t._uU(27),t.ALo(28,"translate"),t.qZA(),t._UZ(29,"input",14),t.ALo(30,"translate"),t.YNc(31,y,3,3,"span",9),t.qZA()(),t.TgZ(32,"div",12)(33,"div",6)(34,"label",15),t._uU(35),t.ALo(36,"translate"),t.qZA(),t._UZ(37,"textarea",16),t.ALo(38,"translate"),t.YNc(39,F,3,3,"span",9),t.qZA()(),t.TgZ(40,"div",17)(41,"div",18),t._UZ(42,"input",19),t.ALo(43,"translate"),t._UZ(44,"div",20),t.qZA()()()()(),t._UZ(45,"app-footer")),2&e&&(t.xp6(2),t.Oqu(t.lcZ(3,15,"CONTACT")),t.xp6(4),t.Q6J("formGroup",r.myForm),t.xp6(5),t.Oqu(t.lcZ(12,17,"Name")),t.xp6(2),t.s9C("placeholder",t.lcZ(14,19,"Name")),t.xp6(2),t.Q6J("ngIf",r.isValidField("name")),t.xp6(4),t.Oqu(t.lcZ(20,21,"Email Address")),t.xp6(2),t.s9C("placeholder",t.lcZ(22,23,"Email Address")),t.xp6(2),t.Q6J("ngIf",r.isValidField("email")),t.xp6(4),t.Oqu(t.lcZ(28,25,"Subject")),t.xp6(2),t.s9C("placeholder",t.lcZ(30,27,"Subject")),t.xp6(2),t.Q6J("ngIf",r.isValidField("subject")),t.xp6(4),t.Oqu(t.lcZ(36,29,"Message")),t.xp6(2),t.s9C("placeholder",t.lcZ(38,31,"Message")),t.xp6(2),t.Q6J("ngIf",r.isValidField("message")),t.xp6(3),t.s9C("value",t.lcZ(43,33,"Send")))},dependencies:[p.O5,Z.L,C.c,a._Y,a.Fj,a.JJ,a.JL,a.sg,a.u,c.X$],styles:[".frontPage[_ngcontent-%COMP%]{display:flex;justify-content:center;background:linear-gradient(#9e1815,#ca2c26) no-repeat;box-shadow:#00000017 0 2px 1px,#00000017 0 4px 2px,#00000017 0 8px 4px,#00000017 0 16px 8px,#00000017 0 0 16px}.container[_ngcontent-%COMP%]{margin-bottom:17.5%}.title[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:15px;margin-bottom:25px;font-weight:bolder;font-size:xxx-large;color:#fff}input[_ngcontent-%COMP%]{height:45px}.box[_ngcontent-%COMP%]{margin-bottom:20px}label[_ngcontent-%COMP%]{margin-bottom:10px}.buttons[_ngcontent-%COMP%]{display:flex;justify-content:center}.button[_ngcontent-%COMP%]{margin-right:15px}.groupButtons[_ngcontent-%COMP%]{display:flex;justify-content:center;width:50%}.btn[_ngcontent-%COMP%]{height:50px;font-weight:500;padding-left:20px;padding-right:20px}.btn-danger[_ngcontent-%COMP%]{background-color:#ca2924!important}.btn-danger[_ngcontent-%COMP%]:hover{background-color:#bb2621!important}"]});const O=[{path:"",component:l}];class s{}s.\u0275fac=function(e){return new(e||s)},s.\u0275mod=t.oAB({type:s}),s.\u0275inj=t.cJS({imports:[u.Bz.forChild(O),u.Bz]});var S=o(4466),T=o(2565),j=o(529);class i{}i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[p.ez,s,S.m,a.UX,c.aw.forRoot({loader:{provide:c.Zw,useFactory:T.g,deps:[j.eN]}})]})}}]);