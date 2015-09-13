//ready事件，兼容IE
(function (){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded', main , false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState =='complete'){
				main();
			}
		});
	}
})();
function main (){
	//弹性导航模块 
	(function (){
		var navList=document.getElementById('navList');
		var aLi=navList.children;
		var oListBox=aLi[aLi.length-1]
		var iNow=0;
		for(var i=0; i<aLi.length-1; i++){
			aLi[i].index=i;
			aLi[i].onmouseenter=function(){
				startMove(oListBox,this.offsetLeft);
			};
		}
	})();
	//主屏图片模块
	;(function (){
		var oPrev=document.getElementById('prev');
		var oNext=document.getElementById('next');
		var oPic=document.getElementById('headerPic');
		var oDiv=document.getElementById('picDiv')
		var Col=5,Row=5;
		var W=1150/Col,H=480/Row;
		var aSpan=[];
		var now=0;
		for (var i=0; i<Row; i++){
			for (var j=0; j<Col; j++){
				var oSpan=document.createElement('span');
				oSpan.style.width=W+'px';
				oSpan.style.height=H+'px';
				var left=j*W;
				var top=i*H;
				oSpan.style.left=left+'px';
				oSpan.style.top=top+'px';
				oSpan.style.backgroundImage='url(images/pic'+now%6+'.jpg)';
				oSpan.style.backgroundPosition=-left+'px '+-top+'px';
				aSpan.push(oSpan);
				oDiv.appendChild(oSpan);
			}
		}
		oNext.onclick=next;
		oPrev.onclick=prev;
		var timer=null;
		next();
		timer=setInterval(function (){
			next();
		},4000);
		for(var i=0; i<aSpan.length; i++){
			aSpan[i].onmouseover=function (){
				clearInterval(timer);
			}
			aSpan[i].onmouseout=function (){
				timer=setInterval(function (){
					next();
				},4000);
			}
		};
		var bFlag=false;
		function next (){
			if(bFlag)return;
			now++;
			bFlag=true;
			splitSport();
		}
		function prev (){
			if(bFlag)return;
			now--;
			if(now==-1){
				now=41;
			}
			bFlag=true;
			splitSport();
		}
		function splitSport() {
			var n=0;
			for(var i=0; i<aSpan.length; i++){
				aSpan[i].style.opacity=0;
				aSpan[i].style.backgroundImage='url(images/pic'+now%7+'.jpg)';
			}
			var timer2=setInterval(function (){
				(function (index){
					move(aSpan[n], {opacity:1}, {
						complete:function (){
							if (index == aSpan.length-1){
								bFlag=false;
								oPic.src='images/pic'+now%7+'.jpg';
							}
						}
					});
				})(n);
				n++;	
				if (n == aSpan.length){
					clearInterval(timer2);
				}
			}, 80);
		}
	})();
	//照片墙模块
	;(function (){
		var oPicUl=document.getElementById('picUl');
		var aLi=oPicUl.children;
		for(var i=0; i<aLi.length; i++){
			enter(aLi[i]);
			leave(aLi[i]);
		}
		function enter(obj)
		{
			var oSpan=obj.getElementsByTagName('span')[0];
			var W=obj.offsetWidth;
			var H=obj.offsetHeight;
			
			obj.onmouseenter=function (ev){
				var oEvent=ev || event;
				var n=getN(obj, oEvent);
				
				switch (n)
				{
					case 0: // right
						oSpan.style.left=W+'px';
						oSpan.style.top=0;
						break;
						
					case 1: // bottom
						oSpan.style.left=0;
						oSpan.style.top=H+'px';
						break;
						
					case 2: // left
						oSpan.style.left=-W+'px';
						oSpan.style.top=0;
						break;
						
					case 3: // top
						oSpan.style.left=0;
						oSpan.style.top=-H+'px';
						break;
				}
				
				move(oSpan, {top:0, left:0});	
			};
		}
		function leave(obj)
		{
			var oSpan=obj.getElementsByTagName('span')[0];
			var W=obj.offsetWidth;
			var H=obj.offsetHeight;
			
			obj.onmouseleave=function (ev){
				var oEvent=ev || event;
				var n=getN(obj, oEvent);

				switch (n)
				{
					case 0:
						move(oSpan, {left:W, top:0});
						break;
						
					case 1:
						move(oSpan, {left:0, top:H});
						break;
						
					case 2:
						move(oSpan, {left:-W, top:0});
						break;
						
					case 3:
						move(oSpan, {left:0, top:-H});
						break;
				}
			};	
		}
		function getN(obj, ev){
			var x=obj.offsetLeft+obj.offsetWidth/2-(ev.clientX-50);
			var y=obj.offsetTop+obj.offsetHeight/2-(ev.clientY-50);
			var n=Math.round((a2d(Math.atan2(y, x))+180)/90)%4;
			return n;
		}
		function a2d(a){
			return a*180/Math.PI;
		}
	})();
	//照片墙切换图片模块
	;(function (){
		var aLi=document.getElementById('picUl').children;
		var aImg=document.getElementById('picUl').getElementsByTagName('img');
		var aPos=[];
		for(var i=0; i<aLi.length; i++){
			var left=aLi[i].offsetLeft;
			var top=aLi[i].offsetTop;
			aPos.push({left:left, top : top});
			aLi[i].style.left=left+'px';
			aLi[i].style.top=top+'px';
		}
		for(var i=0; i<aLi.length; i++){
			aLi[i].style.position='absolute';
			aLi[i].style.margin=0;
		}
		var oBtn=document.getElementById('changeBtn');
		var picArr2=['images/w13.png','images/w8.png','images/w9.png','images/w10.png','images/w11.png',
		'images/w12.png'];
		var picArr1=['images/w1.png','images/w2.png','images/w3.png','images/w4.png','images/w5.png',
		'images/w6.png'];
		var times=0;
		oBtn.onclick=function(){
			var n=0;
			var timer=setInterval(function(){
				(function(index){
				move(aLi[n],{top:0, left: 0, width:0, height:0, opacity:0},
						{
							complete:function(){
								if(index == aLi.length-1){
									end();
								}
							}
						});
				})(n);
				n++;
				if(n == aLi.length){
					clearInterval(timer);
				}
			},150);
		}
		function end(){
			for(var i=0; i<aLi.length; i++){
				if(times%2==0){
					aImg[i].src=picArr2[i];
				}else{
					aImg[i].src=picArr1[i];
				}
			}
			times++;
			var n=aLi.length-1;
			var timer=setInterval(function(){
				move(aLi[n],{width:300, height: 300, left: aPos[n].left, top: aPos[n].top, opacity: 1})
				n--;
				if(n == -1){
					clearInterval(timer);
				}
			},150);
		};
	})();
	//照片墙无缝滚动模块
	;(function (){
		var oUl=document.getElementById('scrollList');
		var w=oUl.offsetWidth;
		oUl.innerHTML+=oUl.innerHTML;
		oUl.style.width=oUl.children[0].offsetWidth*oUl.children.length+'px';
		var timer=null,left=0;
		next();
		function next (){
			clearInterval(timer);
			timer=setInterval(function (){
				left-=1;
				if (left < 0){
					oUl.style.left=left%w+'px';
				}else{
					oUl.style.left=left%w-w+'px';
				}
			}, 10);
		}
		oUl.onmouseover=function (){
			clearInterval(timer);
		}
		oUl.onmouseout=function (){
			next();
		}
	})();
	//BLOG module
	;(function (){
		var oDiv=document.getElementById('p1PicBox');
		var oBlogCont=document.getElementById('blogCont');
		var aDiv=oBlogCont.children;
		var R=oDiv.offsetWidth/2;
		var total=5;
		var aSpan=[];
		//创建一组span
		for(var i=0; i<total; i++){
			var oSpan=document.createElement('span');
			oDiv.appendChild(oSpan);
			aSpan.push(oSpan);
		}
		aSpan[0].innerHTML='交友';
		aSpan[1].innerHTML='联系';
		aSpan[2].innerHTML='博文';
		aSpan[3].innerHTML='关注';
		aSpan[4].innerHTML='点赞';
		for(var i=0; i<aSpan.length; i++){
			aSpan[i].style.display='none';
		}
		oDiv.onmouseenter=function (){
			for (var i=0; i<aSpan.length; i++){
				aSpan[i].style.display='block';
				var a=360*i/total;
				move(aSpan[i], a);
			};
		}
		oDiv.onmouseleave=function (){
			for (var i=0; i<aSpan.length; i++){
					var a=360*i/total;
					move(aSpan[i], 0);
			}
		};
		//选项卡
		for(var i=0; i<aSpan.length; i++){
			(function (index){
				aSpan[i].onmouseover=function (){
					for(var i=0; i<aDiv.length; i++){
						aDiv[i].style.display='none';
					}
					aDiv[index].style.display='block';
				}
			})(i);
		}
		//弧形运动引擎
		function move(obj, target){
			var start=obj.start || 0;
			var dis=target-start;
			var count=Math.floor(1000/30);
			var n=0;
			clearInterval(obj.timer);
			obj.timer=setInterval(function (){
				n++;
				var cur=start+dis*n/count;
				var x=R+Math.sin(d2a(cur))*R;
				var y=R-Math.cos(d2a(cur))*R;
				obj.style.left=x+'px';
				obj.style.top=y+'px';
				if (n == count){
					clearInterval(obj.timer);
					obj.start=cur;
				}
			}, 30);
		};
		function d2a(d){
			return d*Math.PI/180;
		}
	})();
	//BLOG sfq module
	;(function (){
		var oDiv=document.getElementById('bottomCont');
		var aLi=oDiv.getElementsByTagName('li');
		var aSpan=oDiv.getElementsByTagName('span');
		sfq(aLi,aSpan);
	})();
	//music player module
	;(function (){
		var oBtn=document.getElementById('nextBtn').children[0];
		var oplayerBox=document.getElementById('musicPlayer');
		var oName=document.getElementById('musicName');
		var aSongs=['fly me to the moon.mp3','yesterday.mp3','heros morning.mp3'];
		var n=0;
		oBtn.onmouseover=function (){
			oBtn.src='images/nexton.png';
		}
		oBtn.onmouseout=function (){
			oBtn.src='images/next.png';
		}
		oBtn.onclick=function (){
			n++;
			oplayerBox.innerHTML='<embed src="'+aSongs[n%3]+'" class="player" id="player"></embed>';
			oName.innerHTML=aSongs[n%3];
		}
	})();
	//跨域获取百度搜索数据模块 
	;(function (){
		bdList();
	})();
};
//跨域获取百度搜索数据
function bdList(){
	var oT=document.getElementById('bdInp');
	var oUl=document.getElementById('baiduList');
	var oBtn=document.getElementById('searchBtn');
	var iNow=-1;
	var oldValue='';
	oT.onfocus=function (){
		oT.value='';
		oT.style.borderColor='#B76C9D';
	}
	oT.onblur=blur;
	function blur(){
		setTimeout(function (){
			oUl.style.display='none';
			oT.value='百度一下，你就知道';
			oT.style.borderColor='#967ADE';
		},200);
	}
	oT.onkeyup=function(ev){
		var oEvent=ev || event;
		if(oEvent.keyCode==40 || oEvent.keyCode==38)return;
		//回车搜索
		if(oEvent.keyCode==13){
			window.open('https://www.baidu.com/s?wd='+oT.value,'_self');
			oT.value='';
		}
		jsonp({
			url:'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su',
			data:{
				wd:oT.value
			},
			success:function(json){
				var arr=json.s;
				oUl.innerHTML='';
				if(arr.length){
					oUl.style.display='block';
				}else{
					oUl.style.display='none';	
				}
				for(var i=0; i<arr.length; i++){
					var oLi=document.createElement('li');
					oLi.innerHTML=arr[i];
					oUl.appendChild(oLi);
					//给li加事件
					(function(index){
						oLi.onmouseover=function(){
							for(var i=0; i<oUl.children.length; i++){
								oUl.children[i].className='';
							}
							this.className='on';	
							iNow=index;
						};
						oLi.onclick=function(){
							window.open('https://www.baidu.com/s?wd='+this.innerHTML,'_self');
							oT.value='';
						};
					})(i);
				}
			}	
		});	
		oldValue=oT.value;
	};	
	oT.onkeydown=function(ev){
		var aLi=oUl.children;
		var oEvent=ev || event;
		if(oEvent.keyCode==40){
			iNow++;
			if(iNow==aLi.length)iNow=-1;
			
			for(var i=0; i<aLi.length; i++){
				aLi[i].className='';
			}
			if(iNow==-1){
				oT.value=oldValue;
			}else{
				aLi[iNow].className='on';
				oT.value=aLi[iNow].innerHTML;
			}	
		}
		if(oEvent.keyCode==38){
			iNow--;
			if(iNow==-2)iNow=aLi.length-1;
			for(var i=0; i<aLi.length; i++){
				aLi[i].className='';
			}
			if(iNow==-1){
				oT.value=oldValue;
			}else{
				aLi[iNow].className='on';
				oT.value=aLi[iNow].innerHTML;
			}
			return false;	
		}
	};
	//点击搜索
	oBtn.onclick=function(){
		window.open('https://www.baidu.com/s?wd='+oT.value,'_self');
		oT.value='';	
	};
}
//JSONP 
function json2url(json){
	var arr=[];
	for(var name in json){
		arr.push(name+'='+json[name]);
	}
	return arr.join('&');
}
function jsonp(json){
	json=json || {};
	if(!json.url)return;
	json.data=json.data || {};
	json.cbName=json.cbName || 'cb';
	var fnName=('jsonp_'+Math.random()).replace('.','');
	window[fnName]=function(data){
		json.success && json.success(data);
		//删除
		oHead.removeChild(oS);
		window[fnName]=null;
	};
	json.data[json.cbName]=fnName;
	var oS=document.createElement('script');
	oS.src=json.url+'?'+json2url(json.data);
	var oHead=document.getElementsByTagName('head')[0];
	oHead.appendChild(oS);
}


//sfq效果模块
function sfq(obj1,obj2){
	var W=obj1[0].offsetWidth;
	var sW=obj2[0].offsetWidth;
	for (var i=0; i<obj1.length; i++){
		if (i != 0){
			obj1[i].style.left=W+(i-1)*sW+'px';
		}
	}
	for (var i=0; i<obj2.length; i++){
		(function (index){
			obj2[i].onmouseover=function (){
				for (var i=0; i<obj1.length; i++){
					if (i <= index){
						move(obj1[i], {left:i*sW});
					}else{
						move(obj1[i], {left:W+(i-1)*sW});
					}
				}
			};
		})(i);
	}
}
//弹性运动引擎
(function(global){
	var iSpeed=0;
	var left=0;
	var timer=null;
	global.startMove=function(obj,iTarget){
		clearInterval(timer);
		timer=setInterval(function(){
			iSpeed+=(iTarget-obj.offsetLeft)/5;
			iSpeed*=0.7;
			left+=iSpeed;
			obj.style.left=left+'px';
			if(Math.round(iSpeed)==0 && Math.round(left)==iTarget){
				clearInterval(timer);
			}
		},30);	
	}
})(window);
//运动引擎 
var Tween={Linear:function(t,b,c,d){return c*t/d+b},Quad:{easeIn:function(t,b,c,d){return c*(t/=d)*t+b},easeOut:function(t,b,c,d){return -c*(t/=d)*(t-2)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t+b}return -c/2*((--t)*(t-2)-1)+b}},Cubic:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t+b}return c/2*((t-=2)*t*t+2)+b}},Quart:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t+b},easeOut:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t+b}return -c/2*((t-=2)*t*t*t-2)+b}},Quint:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t*t+b}return c/2*((t-=2)*t*t*t*t+2)+b}},Sine:{easeIn:function(t,b,c,d){return -c*Math.cos(t/d*(Math.PI/2))+c+b},easeOut:function(t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOut:function(t,b,c,d){return -c/2*(Math.cos(Math.PI*t/d)-1)+b}},Expo:{easeIn:function(t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOut:function(t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOut:function(t,b,c,d){if(t==0){return b}if(t==d){return b+c}if((t/=d/2)<1){return c/2*Math.pow(2,10*(t-1))+b}return c/2*(-Math.pow(2,-10*--t)+2)+b}},Circ:{easeIn:function(t,b,c,d){return -c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOut:function(t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return -c/2*(Math.sqrt(1-t*t)-1)+b}return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b}},Elastic:{easeIn:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return(a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b)},easeInOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d/2)==2){return b+c}if(!p){p=d*(0.3*1.5)}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}if(t<1){return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b}return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b}},Back:{easeIn:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*(t/=d)*t*((s+1)*t-s)+b},easeOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}if((t/=d/2)<1){return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b}return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b}},Bounce:{easeIn:function(t,b,c,d){return c-Tween.Bounce.easeOut(d-t,0,c,d)+b},easeOut:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else{if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b}else{if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b}}}},easeInOut:function(t,b,c,d){if(t<d/2){return Tween.Bounce.easeIn(t*2,0,c,d)*0.5+b}else{return Tween.Bounce.easeOut(t*2-d,0,c,d)*0.5+c*0.5+b}}}};
function move(obj, json, options){
	// 默认值
	options=options || {};
	options.duration=options.duration || 300;
	options.easing=options.easing || Tween.Linear;
	var start={};
	var dis={};
	for (var name in json){
		start[name]=parseFloat(getStyle(obj, name));
		dis[name]=json[name]-start[name];
	}
	var count=Math.floor(options.duration/30);
	var n=0;
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		n++;
		for (var name in json){
			var cur=options.easing(options.duration*n/count, start[name], dis[name], options.duration);
			if (name == 'opacity'){
				obj.style[name]=cur;
			}else{
				obj.style[name]=cur+'px';
			}
		}
		if (n == count){
			clearInterval(obj.timer);
			options.complete && options.complete();
		}
	}, 30);
}
//获取非行间样式函数
function getStyle(obj, name){
	return (obj.currentStyle || getComputedStyle(obj, false))[name];
}