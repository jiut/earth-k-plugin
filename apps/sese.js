import plugin from '../../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import fetch from "node-fetch";
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const blacklist = []
let CD = {};// 命令CD

let msgRes =[]
let kg = 0
let r18=0
let url = ""
export class sese extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '土块隐藏涩涩',
            /** 功能描述 */
            dsc: '',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1145,
            rule: [
               
                {
                    reg: '^搜索.*$|#搜索.*$',
                    fnc: 'acgs'
                },
				{
                    reg: '^#输入指令(.*)|#开启18$|#关闭18$',
                    fnc: 'ycmm'
                }
				
            ]
     
        })
    }


async ycmm(e) {
	let keyword = e.msg.replace("#输入指令", "");
	console.log(keyword)
	if(keyword=="114514"  & kg==0){
		e.reply("哼哼哼啊啊啊啊啊啊啊，指令正确，你现在可以控制R18了")
		kg =1
	}else if(keyword !="114514"  & kg==0){
	e.reply("你干嘛哎哟，指令错误！")
	}else if(keyword =="你干嘛哎哟"  & kg==1){
	e.reply("你干嘛哎哟，指令正确！，已取消控制权")
	kg =0
	}
	if(e.msg == "#开启18" & kg==1){
		e.reply("已开启R18模式，请注意身体")
		r18=1
	}
	if(e.msg == "#关闭18" & kg==1){
		e.reply("已关闭R18模式，进入养生模式")
		r18=0
	}
	
	
	
}

async acgs(e) {
	let img = []
	
	 let keyword = e.msg.replace("#", "");
         keyword = keyword.replace("搜索", "");
		 if(r18==0){
			 url = `https://api.lolicon.app/setu/v2?tag=${keyword}&proxy=i.pixiv.re&r18=0`;
		 }
		 if(r18==1){
			 url = `https://api.lolicon.app/setu/v2?tag=${keyword}&proxy=i.pixiv.re&r18=1`;
		 }
		   
		
			let response = ""; //调用接口获取数据
            let res =""; //结果json字符串转对象
            let imgurl = "";
			for(let i=0;i<3;i++){
				
				response = await fetch(url);
				res = await response.json();
				img[i] = res.data[0].urls.original;
		

			 }
			
			console.log(img)
		
            if (res.data.length == 0) {
                e.reply("暂时没有搜到哦！换个关键词试试吧！");
                return true;
            }
            let TagNumber = res.data[0].tags.length;
            let Atags;
            let Btags;
            let qwq = 0;
            while (TagNumber--) {
                Atags = res.data[0].tags[TagNumber];
                if (qwq == 0) {
                    Btags = "";
                }
                Btags = Btags + " " + Atags;
                qwq++;
            }
            let msg;
            let pid = res.data[0].pid;
            //最后回复消息
            msg = [

                res.data[0].urls.original,
            ];
            //发送消息		
			
			
			 const puppeteer = require('puppeteer');

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process'
              ]
        });
		let n =0
		for(let i=0;i<img.length;i++){
			const page = await browser.newPage();
			 await page.goto(img[i]);
        await page.setViewport({
            width: 1372,
            height: 756
        });
        msgRes[i] =segment.image(await page.screenshot({
            fullPage: true
        }))
		
		
		
		
		}
        
       
		let msg2 =  ForwardMsg(e,msgRes)
		
		
		
}


  async webPreview(e) {

        const puppeteer = require('puppeteer');

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process'
              ]
        });
        const page = await browser.newPage();
        await page.goto(e.msg);
        await page.setViewport({
            width: 1920,
            height: 1080
        });
    
        let msgRes = await e.reply(segment.image(await page.screenshot({
            fullPage: true
        })))
		
		let timeout = 30000;
		e.reply("给你30秒的时间赶快解决。别让我再看到你！")
    
  //发送消息
  console.log(timeout,msgRes,msgRes.message_id)
  if (timeout!=0 && msgRes && msgRes.message_id){
    let target = null;
	console.log("ch")
    if (e.isGroup) {
      target = e.group;//是否为群聊
    }else{
      target = e.friend;//是否为好友
    }
    if (target != null){
		
      setTimeout(() => {
        target.recallMsg(msgRes.message_id);
      }, timeout);
    }
  } 
        await browser.close();
    }
}

async function ForwardMsg(e, data) {
   
    let msgList = [];
    for (let i=0;i<msgRes.length;i++) {
        msgList.push({
            message: msgRes[i],
            nickname: Bot.nickname,
            user_id: Bot.uin,
        });
    }
    if (msgList.length == 10) {
        await e.reply(msgList[0].message);
    }
    else {
        //console.log(msgList);
        await e.reply(await Bot.makeForwardMsg(msgList));
    }
    return;
}