
# **📌 SocialAI – Smart Social Media Assistant**

An AI-powered content generator and image-analysis chatbot built using **HTML, TailwindCSS, Node.js, Express, and Groq LLaMA models**.

---

## 🚀 **Overview**

**SocialAI** is an intelligent social media assistant that helps users generate captions, threads, professional posts, hashtags, and analyze images for better social media engagement.
It acts as a **personal content strategist** capable of handling both text and images with advanced LLaMA AI models.

---

## 🎯 **Key Features**

### ✅ **1. Multi-Platform Content Creation**

* Instagram captions
* Twitter/X viral threads
* LinkedIn professional posts
* Facebook-style posts
* Trending hashtag suggestions

### ✅ **2. AI-Powered Image Analysis**

Upload any image and SocialAI will:

* Analyze aesthetics
* Suggest best platforms
* Recommend captions
* Provide hashtags
* Give posting strategies

### ✅ **3. Intent-Based Smart Responses**

Your agent automatically detects message type:

* "caption", "instagram" → Caption Mode
* "thread", "twitter" → Thread Mode
* "linkedin", "professional" → LinkedIn Mode
* "analyze", "image" → Vision Analysis Mode
* Otherwise → Default assistant

### ✅ **4. Conversation History System**

* Saves chat sessions automatically
* Click to open past conversations
* Clean “New Chat” option

### ✅ **5. Post Suggestion Modal**

A built-in popup offering:

* Prewritten content ideas
* Custom prompt support
* One-click insertion into chat input

### ✅ **6. Modern UI with Themes**

* Fully responsive UI
* Dark / Light mode switch
* Image preview and delete option

### ✅ **7. Secure Backend**

* Rate-limiting (100 requests / 15 minutes)
* Error handling
* Environment-based API protection

---

## 🧠 **AI Models Used**

| Model Name                       | Purpose                          |
| -------------------------------- | -------------------------------- |
| **llama-3.3-70b-versatile**      | Text-only content generation     |
| **llama-3.2-90b-vision-preview** | Image analysis + text generation |

---

## 🛠️ **Tech Stack**

### **Frontend**

* HTML
* TailwindCSS
* Vanilla JavaScript

### **Backend**

* Node.js
* Express.js
* GROQ LLaMA API

### **Security**

* express-rate-limit
* CORS
* dotenv

---

## 📁 **Project Structure**

```
project/
│── index.html          # Frontend UI
│── server.js           # Node.js backend
│── .env                # API keys (ignored in Git)
│── public/             # Static assets (optional)
└── README.md
```

---

## ⚙️ **Setup Instructions**

### **1️⃣ Install Dependencies**

```
npm install express cors groq-sdk express-rate-limit dotenv
```

### **2️⃣ Add API Key**

Create a file named `.env`:

```
GROQ_API_KEY=your_key_here
```

### **3️⃣ Start the Server**

```
node server.js
```

Server runs at:

```
http://localhost:5000
```

### **4️⃣ Open the Frontend**

Open **index.html** in your browser
OR
Move `index.html` into `/public` so Express hosts it automatically.

---

## 📡 **API Endpoint**

### **POST /api/chat**

#### Request Body:

```json
{
  "contentArray": [
    { "type": "text", "text": "Write an Instagram caption" },
    { "type": "input_image", "image_url": "data:image/png;base64,..."}
  ],
  "history": []
}
```

#### Response:

```json
{
  "content": "Generated response",
  "success": true
}
```

---

## ⚠️ Limitations

* No database (history resets when server restarts)
* Login/Signup not implemented (UI only)
* Requires internet for Groq API
* Supports images but not videos

---

## 💡 Future Improvements

* Add MongoDB user authentication
* Store conversations in DB
* AI-generated images
* Social media auto-posting integration
* Add user analytics dashboard



