import { db } from "../../lib/db.js";

export default async function handler(req,res){
  if(req.method !== "GET") return res.status(405).json({error:"Method not allowed"});

  try{
    const result = await db.query(`
      SELECT * FROM repos WHERE verified=true
      ORDER BY stars DESC, created_at DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch(err){
    res.status(500).json({error:err.message});
  }
}
