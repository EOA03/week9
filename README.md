# Assignment Weekly 9

## INTRODUCTION

This week (week 9), the assignment is about creating an API for a simple M-Banking app to display the user's total balance and total expenses. I created this simple app using Node.js, Express.js, and MySQL.

## FEATURES

- List All User
- List User by ID
- List All Transaction
- Create Transaction
- Update Transaction by ID
- Delete Transaction by ID

| Name                   | HTTP Method | Endpoint        |Requirements|
|------------------------|-------------|-----------------|------------|
|All User                |```GET```    | [/user](https://week-9-eoa03.cyclic.cloud/user)              |             |
|User by ID              |```GET```    | [/user/:id](https://week-9-eoa03.cyclic.cloud/user/1)        |Params : `id:number` |
|All Transaction         |```GET```    | [/transaction](https://week-9-eoa03.cyclic.cloud/transaction)|              |
|Create Transaction      |```POST```   | [/transaction](https://week-9-eoa03.cyclic.cloud/transaction)|Body : `type:string , amount:number , user_id:number` |
|Update Transaction by ID|```PUT```    | [/transaction/:id](https://week-9-eoa03.cyclic.cloud/transaction/1) | Params : `id:number` <br> Body : `type:string , amount:number , user_id:number` |
|Delete Transaction by ID|```Delete``` | [/transaction/:id](https://week-9-eoa03.cyclic.cloud/transaction/1) | Params : `id:number` |

## DEPLOY LINK

The project successfully deplyed using [Cyclic](https://www.cyclic.sh/) and this is the [link](https://week-9-eoa03.cyclic.cloud/).

![Thankyou](https://contenthub-static.grammarly.com/blog/wp-content/uploads/2019/02/bmd-4584.png)