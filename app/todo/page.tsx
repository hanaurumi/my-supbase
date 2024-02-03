import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";
import {id} from "postcss-selector-parser";


export default async function Page() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore)//ログインの有無のパス

    const {data} = await supabase.from('todo').select('*').order('created_at',{ ascending: false})

    //どのデータ(todo)をとってどこに入れる？全ての＊データをとってきて、データに変換して入れる
    //cookieがなければ個人識別がなくなる（大雑把な感じに）

    //const {date:any[]| null }=await supabase.from ('todo).select(columns):('*')
    // データがない場合は、データがありません。と表示する。
    //date:any[]| null 
    if (!data) { 
        return (<div>データがありません。</div>)
    }

    //actionHandlerでtodo.tsxと違うところでサーバーが動くので、改めてcookieを取得している
      async function actionHandler(formData: FormData){
      'use server'
      const cookieStore = cookies();
      const supabase = createClient(cookieStore)
    

    //formの入力の取得
      const values = {
      name: formData.get('name') as string,
      }
    
      const {error} = await supabase.from("todo").insert(values)
      if (error) throw new Error("Error:" + JSON.stringify(error))

      revalidatePath('/todo')
  }
       
      async function deleteActionHandler(formData: FormData) {
        'use sever'
        const cookieStore = cookies();
        const supabase = createClient(cookieStore)

        const {error} = await supabase.from("todo").delete().eq("id", formData.get("id"))
        if (error) throw new Error("Error" + JSON.stringify(error))

        revalidatePath('/todo')

      }

      return(
        <div className={"spase-y-2 "}>
          <form action={actionHandler}>
           <input className={"border"} type="text" name="name" id="name" />
           <button className={"border"} type="submit">タスク追加</button>
          </form>

         {
          data.map((todo) => (
           <div key={todo.id} className={"flex gap-2 items-center"}>
            <form action={deleteActionHandler}>
                <input type={"text"} name={"id"} defaultValue={todo.id} readOnly className={"hidden"}/>
                <button className={"border p-2 "} type={"submit"}>✖︎</button>
            </form>
        </div>
      ))}

      </div>
      //上の<div></div>の中に{}はJavasprictを記載するから、初めの（）はmapの引数のため、つぎの（）はMTHL書くため
    )
}


