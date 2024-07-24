
import os
from dotenv import load_dotenv
import requests
from supabase import create_client


load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# adding the rent properties to the supabase
def addNewDataRent(results):
  num = 0
  for house in results:
    try:
      data, count = supabase.table('HousingData').select('*').eq("id", house["property_id"]).execute()
      if len(data[1]) == 0:
        filteredData = supabase.table("HousingData").insert({"id": house["property_id"], "listingType": "rent", "price": house["list_price_min"], "address": house["location"]["address"]["line"], "listedDate": house["list_date"], "lat": house["location"]["address"]["coordinate"]["lat"], "lon": house["location"]["address"]["coordinate"]["lon"], "photoLink": house["primary_photo"]["href"], "listingID": print(house["listing_id"]), "county": house["location"]["county"]["name"], "purchaseLink": house["href"]}).execute()
        rawData = supabase.table("HousingRawData").insert({"id": house["property_id"], "data": house, "listingType": "rent"}).execute()
        num = num + 1
    except:
      print("problem retrieving data")
  print("Added ", num, " new properties for rent")

# adding the sale properties to the supabase
def addNewDataSale(results):
  num = 0
  for house in results:
    try:
      data, count = supabase.table('HousingData').select('*').eq("id", house["property_id"]).execute()
      if len(data[1]) == 0:
        filteredData = supabase.table("HousingData").insert({"id": house["property_id"], "listingType": "sale", "price": house["list_price"], "address": house["location"]["address"]["line"], "listedDate": house["list_date"], "lat": house["location"]["address"]["coordinate"]["lat"], "lon": house["location"]["address"]["coordinate"]["lon"], "photoLink": house["primary_photo"]["href"], "listingID": print(house["listing_id"]), "county": house["location"]["county"]["name"]}).execute()
        rawData = supabase.table("HousingRawData").insert({"id": house["property_id"], "data": house, "listingType": "sale"}).execute()
        num = num + 1
    except:
      print("problem retrieving data")
  print("Added ", num, " new properties for sale")
  

headers = {
	"X-RapidAPI-Key": os.getenv("HOUSE_KEY"),
	"X-RapidAPI-Host": "us-real-estate.p.rapidapi.com"
}

querystring = {"city":"Chicago","state_code":"IL","limit":"42","offset":"0"}
url = "https://us-real-estate.p.rapidapi.com/v2/for-rent"
response = requests.get(url, headers=headers, params=querystring)
addNewDataRent(response.json()["data"]["home_search"]["results"])

querystring = {"state_code":"IL","city":"Chicago","sort":"newest","offset":"0","limit":"42"}
url = "https://us-real-estate.p.rapidapi.com/v3/for-sale"
response = requests.get(url, headers=headers, params=querystring)
addNewDataSale(response.json()["data"]["home_search"]["results"])