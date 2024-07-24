
import os
from dotenv import load_dotenv
import requests
from supabase import create_client

def addShelters(results):
  num = 0
  for shelter in results:
    try:
      data, count = supabase.table("ShelterData").select("*").eq("name", shelter["name"]).execute()
      if len(data[1]) == 0:
        filteredData = supabase.table("ShelterData").insert({"name": shelter["name"], "address": shelter["address"], "city": shelter["city"], "state": shelter["state"], "zipCode": shelter["zip_code"], "coord": shelter["location"], "phoneNumber": shelter["phone_number"], "email": shelter["email_address"], "website": shelter["official_website"], "desc": shelter["description"], "photo": shelter["photo_urls"][0]}).execute()
        rawData = supabase.table("ShelterRawData").insert({"name": shelter["name"], "data": shelter}).execute()
        num = num + 1
    except:
      print("problem retrieving data")
  print("Found ", num, " new homeless shelters")


supabase = create_client("https://azuagehbxmcquxsenjtd.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dWFnZWhieG1jcXV4c2VuanRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxNjk4MzMsImV4cCI6MjAyMjc0NTgzM30.junj44JwnyuzfKUcaTRUed-FHkh8cbkYP1qvnE8GwVE")
url = "https://homeless-shelter.p.rapidapi.com/state-city"
querystring = {"state":"Illinois","city":"Chicago"}
headers = {
	"X-RapidAPI-Key": "8aba0a6478msh380bec36c40bf4ap1ba398jsn21efae84bac6",
	"X-RapidAPI-Host": "homeless-shelter.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=querystring)
addShelters(response.json())