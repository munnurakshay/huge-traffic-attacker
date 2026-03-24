# Cloud-Based DDoS Simulation and Monitoring System

## Overview

This project is a simple cybersecurity demonstration system that shows how a website can be attacked and monitored in a controlled environment.

A website is hosted locally using XAMPP and exposed to the internet using ngrok. All traffic passes through a Node.js server, which logs requests and displays IP addresses.

The system is designed to attack only the local website and monitor incoming traffic safely.

---

## Objective

* Simulate high traffic (DDoS-like) on a local website
* Expose the site using a public ngrok URL
* Monitor incoming requests and IP addresses
* Identify human and bot traffic

---

## How It Works

1. A website runs on XAMPP (localhost)
2. A Node.js server acts as a proxy layer
3. Ngrok provides a public URL for access
4. All requests pass through the Node server
5. The server logs request details and IP addresses

---

## Features

* Local attack simulation on your own website
* Public access using ngrok
* IP address tracking
* Human and bot classification
* Real-time dashboard for monitoring

---

## Project Structure

```text
project/
│── server.js
│── attack.js
│── dashboard.html
│── package.json
```

---

## Setup Instructions

### 1. Start XAMPP

Run Apache and place your website inside:

```text
htdocs/FIRST
```

### 2. Start Node Server

```bash
node server.js
```

### 3. Open Website

```text
http://localhost:3000
```

### 4. Start Ngrok

```bash
ngrok http 3000
```

### 5. Run Attack (Local Only)

```bash
node attack.js
```

---

## Output

* Displays IP addresses of incoming requests
* Shows request count and activity in dashboard
* Differentiates between normal users and automated traffic

---

## Safety Note

This project is for learning purposes only.
All attacks are limited to your own local system and should not be used on external websites.

---

## Conclusion

This project helps beginners understand how web traffic works, how attacks can be simulated, and how systems can monitor and analyze incoming requests in a safe environment.
