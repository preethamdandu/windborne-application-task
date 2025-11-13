# How to apply
Role info: [`Junior Web Developer`](https://webflow.windbornesystems.com/careers/junior-web-developer)

Make a POST request to `https://windbornesystems.com/career_applications.json` with the following body:
```json
{
  "career_application": {
    "name": "Your name",
    "email": "Your email",
    "role": "Junior Web Developer",
    "notes": "Your specialization + collaboration -- see below",
    "submission_url": "A publicly accessible URL pointing to your coding challenge -- see below",
    "portfolio_url": "A publicly accessible URL pointing to a project of your choice -- see below",
    "resume_url": "A publicly accessible URL pointing to your resume",
  }
}
```

Make sure this gives a status code of `200`! Any other status means it wasn't accepted; check the response body for more.

# Specialization & Collaboration
- Describe in one sentence what makes you good to work with :)

# Showing off
- Post a publicly accessible URL to a single project of your choice. Any project is fine, but it should be something that you're proud of.
- yes I know the field is `portfolio_url`, but I wanna see your passion for a single thing you've created!

# Engineering Challenge
1. Query our **live constellation API**
    - The current positions of our global sounding balloons are at [`https://a.windbornesystems.com/treasure/00.json`](https://a.windbornesystems.com/treasure/00.json).
    - `01.json` is the state an hour ago, `03.json` is from three hours ago, etc, up to 23H ago.
    - The outputs are **undocumented** and may sometimes be **corrupted**—sorryy ¯\\_(ツ)_/¯.
    - You should robustly extract the available flight history for our constellation

2. Find another existing **public dataset/API** and **combine** these two into something!
    - The world is your oyster—have fun with it 🤔
    - This should be the meat of the project, explore and find something **interesting and cool** to you!
    - What insights or problems could you tackle with both of these data feeds?
    - Remember, our API is **live**, so whatever you build should **update dynamically** with the latest `24H` of data.
    - Add a sentence to the `notes` explaining why you chose the external api/dataset you did!

3. **Host your creation** on a publicly accessible URL
    - We can't wait to see what you build!
    - this should be the actual interative webpage, not a static github repo link to the src

If you have questions, submit them via a POST request (just include a way for us to contact you!). **We will not respond to comments on this gist.**

# More about the role
Hopefully you came across this gist from our careers page, but if not, here's the summary!
- [WindBorne Systems](http://windbornesystems.com/) designs, builds, and launches a new kind of smart weather balloon, then plugs this unique data into our own AI-based weather models. Our mission is to build a planetary nervous system. In the process, we can both save a huge amount of carbon emissions and help humanity adapt to extreme weather.
- This is for you if you like deranged software systems and pushing the limits of what's possible. This is not for you if you want a chill job selling ads.

- If(**& ONLY IF**) you do the **entirety of this challenge**, I promise you'll hear back from me personally (usually within a day or two, but could be up to a week)