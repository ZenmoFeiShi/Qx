//2024.8.24 11.44

/*
@Name：通杀所有Emby自动观看保号
@Author：怎么肥事
使用方法：手动观看一次，提示获取成功✅即可食用|可多账号获取
获取完参数请手动关闭重写
[rewrite_local]
^https:\/\/.+\/emby\/Sessions\/Playing\/Stopped url script-request-body https://raw.githubusercontent.com/ZenmoFeiShi/Qx/main/Emby.js

[task_local]
35 22 15,30 * * https://raw.githubusercontent.com/ZenmoFeiShi/Qx/main/Emby.js, tag=Emby自动观看, img-url=https://raw.githubusercontent.com/fmz200/wool_scripts/main/icons/lige47/emby.png, enabled=true

[MITM]
hostname = -*.fileball.app, *

*/
const isRequest = typeof $request !== 'undefined';
const isLoon = typeof $loon !== 'undefined';
const isQX = typeof $notify !== 'undefined' && typeof $done !== 'undefined';

const notify = (title, subtitle, message) => {
    if (isLoon) $notification.post(title, subtitle, message);
    if (isQX) $notify(title, subtitle, message);
};

const setValueForKey = (value, key) => {
    if (isLoon) return $persistentStore.write(value, key);
    if (isQX) return $prefs.setValueForKey(value, key);
    return false;
};

const valueForKey = (key) => {
    if (isLoon) return $persistentStore.read(key);
    if (isQX) return $prefs.valueForKey(key);
    return null;
};

const removeValueForKey = (key) => {
    if (isLoon) return $persistentStore.remove(key);
    if (isQX) return $prefs.removeValueForKey(key);
    return false;
};

var _0xodq='y.js.cn.v7';function _0x11a3(){const _0x1737b2=(function(){return[...[_0xodq,'FTybH.HpjSAWsGQB.eOScNKnI.daHvxd7xuo==','mZlcNH7dJa','jmkbWPhdNIi','qX8XxCoK','qSonWPK','5BAg5A2W5z+w4P6I','tXJdNSoIWQK','ye5bW5uI','bcj0WQy','zHDVkYu','beWnq8kO','W7erWRbvrW','W7HZW6XopW','eLBcTJH9DCoT','r8k4cSoiW78','WR0Jjq1/','iZdcK8kwW7aD','WORdK8o0WOuw','W5XQW5jaaCoRWPXI','umoLzIH3lSkkb8kYqsBcQNi','vW5AnmoTW6eqWO7dTMVcIYi','5Pk85Pws5OMI5yQw8lUEJa','qsmHxq','W53cRfz7','W5/dTSkeWPegF0y','vqtcLcu','W6eDlYeA','zxxdVSogfq','uSk1kCoxW6m','rWvRpGe','WPBdMmoeks4','5AAy6lE/5y+t6i6G5y6x5A2B5y2z5Psz5OIP5yU65yAv6zw06yAM5yAG6ygn5ysF5lQI5B2I6ksj55QEW73dLmoFnG','W5PUW6XXgq','ug84tSksWPm4','WPiTiqu','h1NcJCobWOC','W4GeoY43','dfqkv8kL','FY08rCog','xSocy0m','gZXxWPpdKG','WOtcMq7cU2y','WPVdSbVcThjHmCotCSoTW4ldJa','WR/dISo2fXu','AZb0dH4','W4TZW5fqjG','eZZcLYNdSq','54Q45Okm56cXltq','W7JdO8kYWQmH','ywxdGmouW7G3W419xW8'],...(function(){return[...['kZhdMSoPW7u','EmoDWP8VWRm','luZcQCoaWR4','m8kgWQtdGby','WObshLnAoLTRk8odWPm','C8oPWOKF5O6e6iYj','wCoeygz7','yXRcS8kzWOe','WQRdTCkGxt46FmoSemkuW6q','xCotW47cQehdPxCr','W6aodIKb','W7VdPGGjWOam','W5dcQMDdna','5AE46lsv4P6Y','W4ilfmkACG','FCoOuwv3WOe','W6NcJqeYW6i','AYDPbG','W6mmeSkNqq','WReLnX9Z','jHRdPexcHG','WP9+uCk2hWNcSH4','W5RdRe7dOcCOvSoaumojW4VdTq','s1BcIsLF','WRBdGmoAba4','lCoKsSomWO8','W6RcNen1fa','WRFdQH0MCSoNFmk6nXdcQmoR','F15JW6CG','dmkgWRFdMXm','tsqXzq','WQddM8oltcC','h8o4BmoOWO/dImoFuxRcUIK','j3dcISocWQG','6k2ujuSheUIUHUAXJEw3KEAjIUwiT+InKUwpUEIVIowlNoMfH+wLSEIoUownPq','jSk5kvOh','5BEG5AYj5z2R4PYm','5AA+6lw54PYT','CGBcKIu','W6tdIXayWPe','BCkfW5pcSmof','5P2l5OQI5yMG5lUQ5lYu5BES5l2V5AYq55MM6k+q5Rct','W6VcUCkxv0/cKWJdHmoDWORdUq','WPvJzmk/dq','lePPzHW','ovNdTSoYW4dcH8ocWRlcJZJdVmkx','W5VdQ8k8WQqD','u8oWWOddJJG','tG4DBCoO','54Q05Ok656kQW7SvWRq','cYtdOSoEW4K'],...(function(){return['mGtdIfq','vbZcVmkL5O6+6iYz','tvzqW4y9','BKZdM8oPaW','WRWRWO7cHSkP','eKBdTCkJ','b1bBsXW','WOFcHdpcM1K','W6pcQvr7oa','zCo8q3fo','5PYo5OM85yUq5l6S5A2O55Q3W74jk+AkHEIVIUAWQEwNJG','osTRWQxdSa','k2bZmdZcQ8kwbCkiWOtdVSkU','W4epvre','W77dG8kqWQW1','W5aOW6rzeCo7W59XWRFcVSkWWOC','W6S5W7pcLW','tWhcKZ3cLNZcTfa','W6ldPSk1WRq1','b8k1W59wW6ldTmopWP1lWRHv','ymkTomoDW6u','e8oMuSoAWPW','B8kGW6RcSmoBW4miWOe','c1RdQCocWPddK8kBW7u','WP/dPCobhG','6k+hwCorW4uO6k+y5Rcf5BEH5OQ+5yUc6iYV5y6H6k285yMP6yEE5AwV6i2P5y+E','WRpdRbaKC8oJrmk9eaJcGCoV','C8kYl8oQW5a','WQNdVmoceWNcQG','W6jHW4rSWOSQ','CCoEW4RcU0BdQa','zmotWPO1WPi','WPSGdSkvpa','W4zIW6bRWRi','BGvEjc8','W6xcI8kncxFcNsW9eCoSWOO','6kYy5Rot5AAv5lUy572f5BkdWPJdSSkXhmkVdw1rs8kUpSox','WQuCWO7cOmkx','W6S9WR54Ca','eItcMH7dSGPntCo3ymk+','W6ZdHJ8iWRe','W59EjSkvrq','W6C5aaKOW6W6','W63dU8ksWOmdFvhdKW','6kYLu1NcTqlORPVMSOlLTP/MIktLIklOJkBLJ43ORidLI4xPH4VLPihOJiRLJPe','C0VcSabF','jeddQSoQW57dP8kJW6VdR33cOW','DSk/pSoCW58','WPzfWOXE','WPFdN8kMrYG'];}())];}())];}());_0x11a3=function(){return _0x1737b2;};return _0x11a3();}function _0x5a67(_0x4f78b2,_0x2ceff0){const _0x3fa43b=_0x11a3();return _0x5a67=function(_0x872a00,_0x48f5a2){_0x872a00=_0x872a00-0x1f1;let _0x11a3c7=_0x3fa43b[_0x872a00];if(_0x5a67['avyeCD']===undefined){var _0x5a67ed=function(_0x278408){const _0x5b58c4='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x4d6472='',_0x304aae='',_0x216763=_0x4d6472+_0x5a67ed;for(let _0xea114b=0x0,_0x75ccb5,_0x61b18d,_0x12c8a8=0x0;_0x61b18d=_0x278408['charAt'](_0x12c8a8++);~_0x61b18d&&(_0x75ccb5=_0xea114b%0x4?_0x75ccb5*0x40+_0x61b18d:_0x61b18d,_0xea114b++%0x4)?_0x4d6472+=_0x216763['charCodeAt'](_0x12c8a8+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x75ccb5>>(-0x2*_0xea114b&0x6)):_0xea114b:0x0){_0x61b18d=_0x5b58c4['indexOf'](_0x61b18d);}for(let _0x3347fb=0x0,_0x4fccfb=_0x4d6472['length'];_0x3347fb<_0x4fccfb;_0x3347fb++){_0x304aae+='%'+('00'+_0x4d6472['charCodeAt'](_0x3347fb)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x304aae);};const _0x529d5e=function(_0x37c90f,_0x17f433){let _0x327173=[],_0x5a461c=0x0,_0xe8b313,_0x27fa7b='';_0x37c90f=_0x5a67ed(_0x37c90f);let _0x4e5e74;for(_0x4e5e74=0x0;_0x4e5e74<0x100;_0x4e5e74++){_0x327173[_0x4e5e74]=_0x4e5e74;}for(_0x4e5e74=0x0;_0x4e5e74<0x100;_0x4e5e74++){_0x5a461c=(_0x5a461c+_0x327173[_0x4e5e74]+_0x17f433['charCodeAt'](_0x4e5e74%_0x17f433['length']))%0x100,_0xe8b313=_0x327173[_0x4e5e74],_0x327173[_0x4e5e74]=_0x327173[_0x5a461c],_0x327173[_0x5a461c]=_0xe8b313;}_0x4e5e74=0x0,_0x5a461c=0x0;for(let _0x31bb0a=0x0;_0x31bb0a<_0x37c90f['length'];_0x31bb0a++){_0x4e5e74=(_0x4e5e74+0x1)%0x100,_0x5a461c=(_0x5a461c+_0x327173[_0x4e5e74])%0x100,_0xe8b313=_0x327173[_0x4e5e74],_0x327173[_0x4e5e74]=_0x327173[_0x5a461c],_0x327173[_0x5a461c]=_0xe8b313,_0x27fa7b+=String['fromCharCode'](_0x37c90f['charCodeAt'](_0x31bb0a)^_0x327173[(_0x327173[_0x4e5e74]+_0x327173[_0x5a461c])%0x100]);}return _0x27fa7b;};_0x5a67['pSpmVu']=_0x529d5e,_0x4f78b2=arguments,_0x5a67['avyeCD']=!![];}const _0x523133=_0x3fa43b[0x0],_0x4c5383=_0x872a00+_0x523133,_0x812632=_0x4f78b2[_0x4c5383];if(!_0x812632){if(_0x5a67['rWNINd']===undefined){const _0x5cfae5=function(_0x2525ed){this['THaDWz']=_0x2525ed,this['SmKxwx']=[0x1,0x0,0x0],this['kvuVhI']=function(){return'newState';},this['ubNenq']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['wQUmJk']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x5cfae5['prototype']['QZwvqx']=function(){const _0x293ccb=new RegExp(this['ubNenq']+this['wQUmJk']),_0x58040c=_0x293ccb['test'](this['kvuVhI']['toString']())?--this['SmKxwx'][0x1]:--this['SmKxwx'][0x0];return this['pKYHzW'](_0x58040c);},_0x5cfae5['prototype']['pKYHzW']=function(_0x5642fc){if(!Boolean(~_0x5642fc))return _0x5642fc;return this['ZeprMr'](this['THaDWz']);},_0x5cfae5['prototype']['ZeprMr']=function(_0x5ba973){for(let _0x4228f2=0x0,_0x5c0c6c=this['SmKxwx']['length'];_0x4228f2<_0x5c0c6c;_0x4228f2++){this['SmKxwx']['push'](Math['round'](Math['random']())),_0x5c0c6c=this['SmKxwx']['length'];}return _0x5ba973(this['SmKxwx'][0x0]);},new _0x5cfae5(_0x5a67)['QZwvqx'](),_0x5a67['rWNINd']=!![];}_0x11a3c7=_0x5a67['pSpmVu'](_0x11a3c7,_0x48f5a2),_0x4f78b2[_0x4c5383]=_0x11a3c7;}else _0x11a3c7=_0x812632;return _0x11a3c7;},_0x5a67(_0x4f78b2,_0x2ceff0);};const _0x2c2ec1=_0x5a67;(function(_0x377d09,_0x4c585d,_0x1cc8a3,_0x4d7ddd,_0x3b8265,_0x51666b,_0x1130cd){return _0x377d09=_0x377d09>>0x4,_0x51666b='hs',_0x1130cd='hs',function(_0x3a81ff,_0x36d2a8,_0x4c4be8,_0x5c08ba,_0x455491){const _0x1e33b5=_0x5a67;_0x5c08ba='tfi',_0x51666b=_0x5c08ba+_0x51666b,_0x455491='up',_0x1130cd+=_0x455491,_0x51666b=_0x4c4be8(_0x51666b),_0x1130cd=_0x4c4be8(_0x1130cd),_0x4c4be8=0x0;const _0x53bbe0=_0x3a81ff();while(!![]&&--_0x4d7ddd+_0x36d2a8){try{_0x5c08ba=parseInt(_0x1e33b5(0x219,'&K(m'))/0x1+-parseInt(_0x1e33b5(0x252,'U1CR'))/0x2+parseInt(_0x1e33b5(0x202,'sBpu'))/0x3*(parseInt(_0x1e33b5(0x281,'i(S)'))/0x4)+parseInt(_0x1e33b5(0x24d,'jyZk'))/0x5+-parseInt(_0x1e33b5(0x226,'&K(m'))/0x6*(-parseInt(_0x1e33b5(0x261,'YmD&'))/0x7)+parseInt(_0x1e33b5(0x218,'2n2S'))/0x8+parseInt(_0x1e33b5(0x23b,'[dj^'))/0x9*(-parseInt(_0x1e33b5(0x236,'sKZK'))/0xa);}catch(_0x54da84){_0x5c08ba=_0x4c4be8;}finally{_0x455491=_0x53bbe0[_0x51666b]();if(_0x377d09<=_0x4d7ddd)_0x4c4be8?_0x3b8265?_0x5c08ba=_0x455491:_0x3b8265=_0x455491:_0x4c4be8=_0x455491;else{if(_0x4c4be8==_0x3b8265['replace'](/[aHpTdQGeuxIBNWboAOFSK=]/g,'')){if(_0x5c08ba===_0x36d2a8){_0x53bbe0['un'+_0x51666b](_0x455491);break;}_0x53bbe0[_0x1130cd](_0x455491);}}}}}(_0x1cc8a3,_0x4c585d,function(_0x3f7822,_0x6bf976,_0x14f870,_0x10bbb7,_0xdfc9ec,_0x523f4c,_0xc7a485){return _0x6bf976='\x73\x70\x6c\x69\x74',_0x3f7822=arguments[0x0],_0x3f7822=_0x3f7822[_0x6bf976](''),_0x14f870=`\x72\x65\x76\x65\x72\x73\x65`,_0x3f7822=_0x3f7822[_0x14f870]('\x76'),_0x10bbb7=`\x6a\x6f\x69\x6e`,(0x17f89f,_0x3f7822[_0x10bbb7](''));});}(0xca0,0x35d4a,_0x11a3,0xcc),_0x11a3)&&(_0xodq=_0x11a3);const _0x53e7df=(_0x3a032d,_0x10b54c)=>_0x3a032d+'_'+_0x10b54c,_0x469fa1='Emby_request',_0x559f51=_0x19b30d=>{const _0x5c4557=_0x5a67,_0x2f37ec={'jcfqd':function(_0x4c5537,_0x2ff717,_0x5dc80e,_0x4a450e){return _0x4c5537(_0x2ff717,_0x5dc80e,_0x4a450e);},'HQetm':'已存在✅','PvmzL':function(_0x226b3d,_0x5cf77a){return _0x226b3d(_0x5cf77a);},'MflwE':function(_0x2b1134,_0x227534){return _0x2b1134!==_0x227534;},'ixKFz':_0x5c4557(0x251,'U1CR')},_0x48f601={};for(const _0x50c23d in _0x19b30d){if(_0x2f37ec[_0x5c4557(0x275,'wRl!')](_0x5c4557(0x258,'BA)l'),_0x2f37ec[_0x5c4557(0x265,'4L)[')]))_0x48f601[_0x50c23d[_0x5c4557(0x23f,'9Acf')]()]=_0x19b30d[_0x50c23d];else{_0x2f37ec[_0x5c4557(0x214,'tX(I')](_0x56262e,_0x5c4557(0x26a,'6Xgi')+_0x10da7a+'捕获',_0x2f37ec[_0x5c4557(0x270,'F85I')],_0x5c4557(0x200,'w)^O')),_0x2f37ec[_0x5c4557(0x211,'cY0l')](_0x4442da,{});return;}}return _0x48f601;},_0x23b4fd=()=>{const _0x41a603=_0x5a67,_0x5dd073={'vJjtl':function(_0x28ca16,_0x2f48f8){return _0x28ca16(_0x2f48f8);},'CGUic':function(_0x2e8caf,_0x33ee20,_0x192fc8){return _0x2e8caf(_0x33ee20,_0x192fc8);},'rkmEj':function(_0x4aec14,_0x17c288){return _0x4aec14(_0x17c288);},'WSwTL':_0x41a603(0x279,'cY0l'),'YdWgc':function(_0xe529aa,_0x3aa473){return _0xe529aa(_0x3aa473);},'dEVsR':function(_0x35f944,_0x5ba313,_0x2edd91){return _0x35f944(_0x5ba313,_0x2edd91);},'nANLW':_0x41a603(0x25a,'2n2S')},_0x513076=new Set();let _0x4889d1=0x1;while(!![]){if(_0x41a603(0x222,'5JgG')===_0x41a603(0x250,'QPxI'))_0x40a002['add'](_0x317a5e);else{const _0x54dee1=_0x5dd073['CGUic'](_0x53e7df,_0x469fa1,_0x4889d1+_0x41a603(0x27b,'7pl*')),_0x4d1cef=_0x5dd073[_0x41a603(0x23e,'sBpu')](valueForKey,_0x54dee1);if(!_0x4d1cef)break;const _0x29945b=JSON[_0x41a603(0x256,'hzl6')](_0x4d1cef),_0x55fb9b=_0x29945b[_0x5dd073['WSwTL']];_0x513076['has'](_0x55fb9b)?(_0x5dd073['vJjtl'](removeValueForKey,_0x53e7df(_0x469fa1,_0x4889d1+_0x41a603(0x204,'VVf9'))),_0x5dd073[_0x41a603(0x225,'cY0l')](removeValueForKey,_0x53e7df(_0x469fa1,_0x4889d1+_0x41a603(0x1ff,'4L)['))),_0x5dd073[_0x41a603(0x239,'BA)l')](removeValueForKey,_0x5dd073[_0x41a603(0x1fc,'OFkZ')](_0x53e7df,_0x469fa1,_0x4889d1+_0x41a603(0x267,'o42a')))):_0x5dd073[_0x41a603(0x22b,'o42a')]===_0x5dd073[_0x41a603(0x21f,'tCme')]?_0x513076['add'](_0x55fb9b):_0x5dd073[_0x41a603(0x25f,'%ska')](_0x6de46c,_0x149489),_0x4889d1++;}}};if(isRequest){const _0x430a91=$request[_0x2c2ec1(0x209,'vR1b')],_0x3440eb=_0x559f51($request[_0x2c2ec1(0x1fe,'tCme')]),_0x5980b7=$request[_0x2c2ec1(0x25d,'7pl*')],_0x583199=_0x3440eb['x-emby-token'];if(!_0x583199){notify(_0x2c2ec1(0x26b,'sBpu'),_0x2c2ec1(0x25c,'tCme'),'请求头中缺少X-Emby-Token'),$done({});return;}let _0x542ea6=0x1,_0x25235b,_0x4b819b,_0x416ce7;while(valueForKey(_0x53e7df(_0x469fa1,_0x542ea6+'_url'))){const _0x507bc1=valueForKey(_0x53e7df(_0x469fa1,_0x542ea6+_0x2c2ec1(0x240,'j!rw')));if(_0x507bc1&&JSON[_0x2c2ec1(0x249,'$)lt')](_0x507bc1)['x-emby-token']===_0x583199){notify(_0x2c2ec1(0x282,'YmD&')+_0x542ea6+'捕获',_0x2c2ec1(0x25b,'4Q(b'),_0x2c2ec1(0x259,'[dj^')),$done({});return;}_0x542ea6++;}_0x25235b=_0x53e7df(_0x469fa1,_0x542ea6+_0x2c2ec1(0x21c,'U1CR')),_0x4b819b=_0x53e7df(_0x469fa1,_0x542ea6+'_headers'),_0x416ce7=_0x53e7df(_0x469fa1,_0x542ea6+_0x2c2ec1(0x231,'5JgG')),setValueForKey(_0x430a91,_0x25235b),setValueForKey(JSON['stringify'](_0x3440eb),_0x4b819b),_0x5980b7&&setValueForKey(_0x5980b7,_0x416ce7),notify(_0x2c2ec1(0x21e,'7pl*')+_0x542ea6+'捕获','成功✅',_0x2c2ec1(0x224,'U1CR')),$done({});}else{async function _0x5a07ac(_0x4d3f0c){const _0x36c0eb=_0x2c2ec1,_0x3f6598={'RsCTu':function(_0x908723,_0x4275fc,_0x308481){return _0x908723(_0x4275fc,_0x308481);},'JpEAF':function(_0x5f0043,_0x1119ef){return _0x5f0043(_0x1119ef);},'kqsfZ':function(_0x542005,_0x5a3fe8,_0x5ede9b){return _0x542005(_0x5a3fe8,_0x5ede9b);},'LPgNR':function(_0x184700,_0x2ee1f4){return _0x184700(_0x2ee1f4);},'upVZC':function(_0x2a0ef3,_0x4c5f95){return _0x2a0ef3===_0x4c5f95;},'TkexY':_0x36c0eb(0x1f3,'Qn*b'),'REtAB':function(_0x3b7b9e,_0x2f5166,_0x259682,_0x469b62){return _0x3b7b9e(_0x2f5166,_0x259682,_0x469b62);},'Ywdid':_0x36c0eb(0x23c,'Qn*b'),'qLogz':_0x36c0eb(0x244,'VVf9'),'PuBVR':_0x36c0eb(0x1f8,'Rm)('),'PCHle':function(_0x3c591f,_0x234839){return _0x3c591f(_0x234839);},'GiBaD':_0x36c0eb(0x1f5,'b(^c'),'JoFAR':_0x36c0eb(0x271,'jyZk'),'UuPhv':function(_0x4d727c,_0x1db222,_0x48dce6){return _0x4d727c(_0x1db222,_0x48dce6);},'oRoDL':function(_0x35943c,_0x27ee67){return _0x35943c===_0x27ee67;},'QsNhR':_0x36c0eb(0x22f,'jyZk'),'oTiXo':_0x36c0eb(0x283,'E!&F'),'vmAev':_0x36c0eb(0x285,'U4Op'),'NYtIb':_0x36c0eb(0x21b,'o42a'),'jodPz':function(_0x4be826,_0xd5430c){return _0x4be826!==_0xd5430c;},'mBTHk':_0x36c0eb(0x26c,'DBmn'),'cvPdU':function(_0x31c0ed,_0x2e9dcc){return _0x31c0ed||_0x2e9dcc;},'gDpbv':_0x36c0eb(0x205,'9Acf'),'sxjiO':_0x36c0eb(0x274,'6o)P'),'cKWYm':function(_0x4191b5,_0x5208ed,_0x4cae2,_0x3ff257){return _0x4191b5(_0x5208ed,_0x4cae2,_0x3ff257);},'FpLTT':_0x36c0eb(0x21a,'o42a')};try{if(_0x3f6598['jodPz']('GHADT',_0x3f6598['mBTHk'])){const _0x49e32b=_0x3f6598[_0x36c0eb(0x208,'o42a')](_0x53e7df,_0x469fa1,_0x4d3f0c+_0x36c0eb(0x27a,'(VEF')),_0x1fb863=_0x3f6598[_0x36c0eb(0x243,'U1CR')](_0x53e7df,_0x469fa1,_0x4d3f0c+'_headers'),_0x310cea=_0x53e7df(_0x469fa1,_0x4d3f0c+'_body'),_0x17beda=valueForKey(_0x49e32b),_0x5e84ea=_0x3f6598[_0x36c0eb(0x223,'YmD&')](valueForKey,_0x1fb863),_0xbdd6fc=_0x3f6598[_0x36c0eb(0x278,'4L)[')](valueForKey,_0x310cea);if(_0x3f6598[_0x36c0eb(0x232,'cY0l')](!_0x17beda,!_0x5e84ea)){if(_0x3f6598[_0x36c0eb(0x22a,'&K(m')](_0x3f6598[_0x36c0eb(0x22e,'jyZk')],_0x3f6598['gDpbv']))_0x2a6b23(_0x3f6598['RsCTu'](_0xc44cb5,_0x466f2f,_0x58141b+_0x36c0eb(0x248,'5JgG'))),_0x3f6598['JpEAF'](_0x1eaf8b,_0x3f6598[_0x36c0eb(0x228,'BA)l')](_0x4366b7,_0x566589,_0x3c9825+'_headers')),_0x3f6598[_0x36c0eb(0x26d,'E!&F')](_0x524a30,_0x3f6598[_0x36c0eb(0x273,'Ko%d')](_0x3ab405,_0x5dc303,_0x3fc489+'_body'));else throw new Error(_0x3f6598['sxjiO']);}const _0xb10e4e=JSON[_0x36c0eb(0x253,'DBmn')](_0x5e84ea),_0x2813b5=await new Promise((_0xfeaa05,_0x3a504c)=>{const _0x2876a9=_0x36c0eb,_0x280a81={'oqPAg':function(_0x4ca677,_0x5ea248){const _0x228d72=_0x5a67;return _0x3f6598[_0x228d72(0x254,'n$B#')](_0x4ca677,_0x5ea248);},'UTcqH':function(_0x26ac70,_0x1cb81d){return _0x26ac70===_0x1cb81d;},'nMyVo':_0x3f6598[_0x2876a9(0x220,'E!&F')],'JQBTN':_0x3f6598[_0x2876a9(0x210,'oe$K')],'VpiQw':function(_0x42c89e,_0x42832a,_0x2c1da1){const _0x507643=_0x2876a9;return _0x3f6598[_0x507643(0x262,'w)^O')](_0x42c89e,_0x42832a,_0x2c1da1);},'VfDsg':function(_0x20b1cc,_0x1e7428){return _0x3f6598['oRoDL'](_0x20b1cc,_0x1e7428);},'ioITc':_0x3f6598[_0x2876a9(0x24b,'6Xgi')],'GXZCz':_0x2876a9(0x20a,'BA)l'),'uDApg':_0x3f6598[_0x2876a9(0x24e,'6o)P')]};if(_0x3f6598[_0x2876a9(0x23a,'n$B#')](_0x2876a9(0x245,'$)lt'),_0x3f6598['vmAev'])){if(isLoon)$httpClient[_0x2876a9(0x20d,'wRl!')]({'url':_0x17beda,'headers':_0xb10e4e,'body':_0xbdd6fc},(_0x17cc5f,_0xfc5a3d,_0xe20c94)=>{const _0x150103=_0x2876a9,_0x43717e={'WIPqo':function(_0xee8467,_0x41bf90){const _0x452a83=_0x5a67;return _0x280a81[_0x452a83(0x247,'XTqN')](_0xee8467,_0x41bf90);}};if(_0x280a81['UTcqH'](_0x280a81['nMyVo'],_0x280a81[_0x150103(0x1fd,'uStZ')]))_0x17cc5f?_0x280a81[_0x150103(0x22d,'wRl!')](_0x3a504c,_0x17cc5f):_0x280a81[_0x150103(0x1f9,'HEV8')]!=='RcKzi'?_0x280a81[_0x150103(0x20c,'DBmn')](_0xfeaa05,_0xfc5a3d):_0x35de60[_0x150103(0x269,'(JD[')]({'url':_0x41dfde,'method':_0x150103(0x22c,'Ko%d'),'headers':_0x330bd9,'body':_0x31ccd5})['then'](_0x18e401=>{const _0x284f29=_0x150103;_0x43717e[_0x284f29(0x23d,'Ko%d')](_0x2ad74e,_0x18e401);},_0xbb6185=>{_0x195589(_0xbb6185);});else{const _0x17878c={'JcbGB':function(_0x166820,_0x4badd7){const _0x5b9669=_0x150103;return _0x43717e[_0x5b9669(0x201,'6o)P')](_0x166820,_0x4badd7);}};_0x47618f[_0x150103(0x277,'[dj^')]({'url':_0x58931e,'headers':_0x2b52a7,'body':_0x12b348},(_0x49ba80,_0x3137d9,_0x54accb)=>{const _0x229d34=_0x150103;_0x49ba80?_0x17878c['JcbGB'](_0x30f318,_0x49ba80):_0x17878c[_0x229d34(0x1f4,'hhP)')](_0x4f95dc,_0x3137d9);});}});else isQX&&$task[_0x2876a9(0x24a,'tX(I')]({'url':_0x17beda,'method':_0x3f6598[_0x2876a9(0x238,'Qn*b')],'headers':_0xb10e4e,'body':_0xbdd6fc})['then'](_0x4a999d=>{const _0x4aff73=_0x2876a9;if(_0x3f6598[_0x4aff73(0x20b,'i(S)')](_0x4aff73(0x1f6,'5JgG'),_0x3f6598[_0x4aff73(0x203,'U4Op')])){const _0x151a6a=_0x280a81[_0x4aff73(0x27f,'QPxI')](_0xa8f2a5,_0x280a81['VpiQw'](_0x22967b,_0x479f05,_0x201513+_0x4aff73(0x24c,'w)^O')));if(_0x151a6a&&_0x280a81['VfDsg'](_0x25832d[_0x4aff73(0x221,'U4Op')](_0x151a6a)[_0x280a81['ioITc']],_0x27542f)){_0x312c25(_0x4aff73(0x26f,'&yad')+_0x508c1e+'捕获',_0x280a81[_0x4aff73(0x229,'tCme')],_0x280a81['uDApg']),_0x3ad6b5({});return;}_0x46bcec++;}else _0xfeaa05(_0x4a999d);},_0x107bf9=>{const _0x59c839=_0x2876a9;_0x3f6598[_0x59c839(0x235,'4L)[')](_0x3a504c,_0x107bf9);});}else{_0x3f6598[_0x2876a9(0x20e,'5JgG')](_0x1226b9,_0x3f6598['Ywdid'],_0x3f6598['qLogz'],_0x3f6598[_0x2876a9(0x27c,'4L)[')]),_0x3f6598[_0x2876a9(0x1fa,'oe$K')](_0x4cb851,{});return;}});_0x2813b5[_0x36c0eb(0x286,'YmD&')]===0xcc||_0x3f6598[_0x36c0eb(0x241,'tCme')](_0x2813b5['statusCode'],0xcc)?_0x3f6598[_0x36c0eb(0x263,'F85I')](notify,'Emby'+_0x4d3f0c,_0x3f6598[_0x36c0eb(0x237,'(JD[')],_0x36c0eb(0x268,'j!rw')):notify('Emby'+_0x4d3f0c,'失败',_0x36c0eb(0x234,'Ko%d')+(_0x2813b5[_0x36c0eb(0x1f1,'b(^c')]||_0x2813b5['statusCode']));}else _0xdbdcc(_0x34df35,_0x57b351);}catch(_0x16c40c){notify(_0x36c0eb(0x227,'tX(I')+_0x4d3f0c,'错误','错误信息:\x20'+(_0x16c40c[_0x36c0eb(0x21d,'4L)[')]||_0x16c40c));}}async function _0x1c241c(){const _0x4c8390=_0x2c2ec1,_0x295b16={'bwcDw':_0x4c8390(0x264,'sBpu'),'vskPZ':function(_0x5b2ed7,_0x599880){return _0x5b2ed7!==_0x599880;},'HjrRw':'WmDJU','lHycr':function(_0x57222e,_0x3fd1f3){return _0x57222e(_0x3fd1f3);},'SfBrp':function(_0x4e9c56,_0x5ccc3e,_0x50e199){return _0x4e9c56(_0x5ccc3e,_0x50e199);},'eBUpi':function(_0x104f8c){return _0x104f8c();},'dOuPl':function(_0x2bb415,_0x2e115a){return _0x2bb415(_0x2e115a);},'VrmyW':function(_0x43555d,_0x3c91b6){return _0x43555d===_0x3c91b6;},'ByjsJ':function(_0x1e04f4,_0x5f53d9){return _0x1e04f4===_0x5f53d9;},'XoQKU':'Emby'},_0x29394e=(function(){let _0x286fa0=!![];return function(_0xa44f8a,_0x2489cc){const _0x4aa27b=_0x286fa0?function(){const _0x872774=_0x5a67;if(_0x2489cc){const _0x82c325=_0x2489cc[_0x872774(0x272,'U1CR')](_0xa44f8a,arguments);return _0x2489cc=null,_0x82c325;}}:function(){};return _0x286fa0=![],_0x4aa27b;};}()),_0x1b3539=_0x295b16[_0x4c8390(0x26e,'HEV8')](_0x29394e,this,function(){const _0x444efa=_0x4c8390;return _0x295b16['vskPZ'](_0x444efa(0x27e,'U4Op'),_0x295b16['HjrRw'])?_0x1b3539['toString']()[_0x444efa(0x246,'Ko%d')](_0x295b16[_0x444efa(0x233,'PmEt')])[_0x444efa(0x280,'%ska')]()[_0x444efa(0x1fb,'PmEt')](_0x1b3539)[_0x444efa(0x215,'sKZK')](_0x295b16[_0x444efa(0x207,'n$B#')]):_0x1bcd04['toString']()[_0x444efa(0x1f2,'j!rw')](rKKyFF[_0x444efa(0x20f,'&K(m')])[_0x444efa(0x217,'cY0l')]()[_0x444efa(0x257,'QPxI')](_0x269787)[_0x444efa(0x242,'OFkZ')]('(((.+)+)+)+$');});_0x295b16[_0x4c8390(0x230,'YmD&')](_0x1b3539),_0x295b16[_0x4c8390(0x216,'Rm)(')](_0x23b4fd);let _0x185052=0x1;while(_0x295b16[_0x4c8390(0x25e,'OFkZ')](valueForKey,_0x53e7df(_0x469fa1,_0x185052+_0x4c8390(0x255,'4Q(b')))){await _0x295b16[_0x4c8390(0x266,'vR1b')](_0x5a07ac,_0x185052),_0x185052++;}_0x295b16['VrmyW'](_0x185052,0x1)&&(_0x295b16[_0x4c8390(0x206,'PmEt')](_0x4c8390(0x213,'U4Op'),'elQly')?notify(_0x295b16['XoQKU'],'错误',_0x4c8390(0x260,'2n2S')):_0x4a9c71?_0x295b16[_0x4c8390(0x24f,'YmD&')](_0x34ccbc,_0x240045):_0x182b92(_0x3976db)),$done();}_0x1c241c();}