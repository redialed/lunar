
# Lunar

Lunar is a recreation of the old Instagram API to revive old versions of the app, it functions on a custom server that isn't linked in any way to the official Instagram servers.

This code is a mess and I do apologize about that, I am still not an expert at writing backend code :/

If you need help setting this up or making it work with your phone, add me on Discord (ppvris) or DM me on [Telegram](https://t.me/xpvris)

Lunar is not affiliated with Instagram/Meta in any way, this project is for educational purposes to revive older versions of the application.
 
## Compatibility

**Android:** from 7.17.0 to 10.3.2

**Windows Phone:** 6tag: kinda works?, Instagram Beta: crashes very often

**Windows 10 Desktop (UWP):** Untested, and UWP version of Instagram for Windows is lost media, only PWA (web app) can be downloaded due to MS Store not serving old versions.

**iOS:** Crashes immediately after logging in

**watchOS:** Untested, part of certain iOS IG clients

**Tizen:** Untested, all versions of the client are lost media

## Install

*Make sure to have MongoDB on your computer/server first then follow these steps:*

Clone the project

```bash
  git clone https://github.com/dialedup/lunar.git
```

Go to the project directory

```bash
  cd lunar
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV` (can be production/prod or dev)

`MONGO_URL`

`MONGO_USER`

`MONGO_PASS`


## Configuration

`host` is used to make sure we get the right host link everywhere in the code where it needs it

`autoFollowList` is an array of user ID's that will be automatically followed everytime someone makes a new account

`reservedUsernames` are usernames that can't be taken when registering an account, even if an account with that username doesn't exist

## Author & Contributors

**Author:**

- [@lvuu](https://www.github.com/lvuu)

- with the help of GitHub Copilot (as i said i AM a beginner so copilot helped <3)

**Contributors:**

- None yet, contributions are always welcome!

## Credits

- Some of the code was taken and rewritten in Node from [@Savefade](https://www.github.com/Savefade)'s [LegacyIGN](https://github.com/Savefade/LegacyIGN) PHP code.
