# pip install requests

import os
from dotenv import load_dotenv
import requests
from supabase import create_client


load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# adding the job listingsto the supabase
def addNewData(results):
  num = 0

  for job in results:
    try:
      ben = "\n".join(job["job_highlights"]["Benefits"])
    except:
      ben = None

    try:
      resp = "\n".join(job["job_highlights"]["Responsibilities"])
    except:
      resp = None

    try:
      qual = "\n".join(job["job_highlights"]["Qualifications"])
    except:
      qual = None

    try:
      data, count = supabase.table('JobData').select('*').eq("jobID", job["job_id"]).execute()
      if len(data[1]) == 0:
        filteredData = supabase.table("JobData").insert({"jobID": job["job_id"], "employerName": job["employer_name"], "employer_logo": job["employer_logo"], "employerWebsite": job["employer_website"], "employmentType":  job["job_employment_type"], "jobTitle": job["job_title"], "applyLink": job["job_apply_link"], 
        "postedDate": job["job_posted_at_datetime_utc"], "city": job["job_city"], "state": job["job_state"], "country": job["job_country"], "lat": float(job["job_latitude"]), "lon": float(job["job_longitude"]), "exprDate": job["job_offer_expiration_datetime_utc"], "benefits": ben,
        "desc": job["job_description"], "resp": resp, "qual": qual, "occupationType": job["job_job_title"]}).execute()
        rawData = supabase.table("JobRawData").insert({"jobID": job["job_id"], "data": job}).execute()
        num = num + 1
    except Exception as e:
      print("problem retriving data: ", e)
  print("Added ", num, " new job listings\n")


url = "https://jsearch.p.rapidapi.com/search"
querystring = {"query":"Chicago","page":"1" ,"num_pages":"20"}
headers = {
  "X-RapidAPI-Key": os.getenv("JOB_KEY"),
  "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}
response = requests.get(url, headers=headers, params=querystring)
addNewData(response.json()["data"])