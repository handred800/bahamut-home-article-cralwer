# 巴哈小屋文章 API
node.js 做的簡單爬蟲

## 👌注意事項
*設定隱藏的文章爬蟲讀不到喔*  

### 參數
| API參數     | 對應巴哈小屋網址        | 備註                                             |
|-------------|-------------------------|--------------------------------------------------|
| owner(必填) | owner                   | 巴哈ID(帳號)                                     |
| c           | c                       | 分類ID(資料夾)  搭配參數collection使用            |
| collection  | .php的名稱(?前面那一段) | 預設為creation  有用到c的話要使用creationCategory |

只有owner的話是取用所有的文章，c和collection要搭配使用  

## 🗄資料結構
資料排序按照實際頁面排序(置頂優先級高於張貼時間)  

```js
{
  "success": true,
  "data": [
    {
      "id": "2318428", // id
      "title": "冷門好番(其實有些不冷)", // 標題
      "url": "https://home.gamer.com.tw/creationDetail.php?sn=2318428", // 網址
      "image": "https://p2.bahamut.com.tw/HOME/creationCover/28/0002318428.PNG", // 封面圖
      "meta": {
        "date": "2014-01-22", // 發佈日期
        "coin": 28, // 巴幣
        "view": 353, // 觀看數
        "gp": 5 // GP數
      },
      ... 
    },
  ];
}

//無資料時(查不到ID 或 小屋沒有文章)
{
  "success": false,
  "data": {
    "message": "查無使用者或是此使用者無創作"
  }
}
```
