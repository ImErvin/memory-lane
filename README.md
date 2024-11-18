# Memory Lane

> **Note**: This project is built using the [T3 Stack](https://create-t3.gg/) and was bootstrapped with `create-t3-app`.

You can explore the project at: [ervin-memorylane.vercel.app](https://ervin-memorylane.vercel.app)

## Project Overview

The core idea behind _Memory Lane_ was to create a website with a flow similar to this concept:
![Flow Illustration](image.png)

### Learning tRPC

One of my goals with this project was to get hands-on experience with tRPC, which had been on my list for a while. This project provided the perfect opportunity to dive in, and I must say, tRPC is fantastic—especially in combination with a Next.js setup.

### Tech Choices

I opted for Next.js over the Vite environment for a few key reasons:

- **Familiarity**: I have extensive experience with Next.js.
- **Convenience**: The T3 Stack simplifies the setup process by bootstrapping and integrating Next.js seamlessly with tRPC.

For the database, I chose **Prisma**, primarily due to my familiarity with it. Since I was already focused on learning tRPC for this project, I decided not to add the extra complexity of learning a new ORM, such as Drizzle (I remember you mentioned that you use that in-house). My main goal was to deploy this project in a dedicated environment (I used Vercel), allowing others to test it without the need to run it locally. If you'd like to try running it locally, feel free to reach out, and I can share my `.env` file.

### Session Management

Initially, I considered implementing a user model but ultimately decided to use a persisted local storage store that simulates an hour-long session by revoking the token after one hour. This approach allowed me to progress without needing to build a full authentication flow with JWTs, secrets, or OAuth. However, a user model and authentication system could be easily added if needed in the future.

### Data Models

The current app features two main models:

- **Lanes**: Collections that own memories.
- **Memories**: Individual records within lanes.

![alt text](image-1.png)

Since there is no user model, I’m saving the provided username directly via the API. While this isn't secure, the project’s primary goal was not user authentication but rather to showcase the concept. This can be enhanced later by introducing a user model and using an authentication solution like NextAuth to manage JWTs and sessions.

### UI and Animations

I utilized **shadcn** for UI components, which simplifies styling compared to manually working with Radix UI. While the design isn't particularly polished, it incorporates some good UX practices and could certainly be visually improved.

I also integrated **react-spring** to add animations and demonstrate my proficiency. Admittedly, some animations might feel a bit over-the-top, but they serve as examples for this demo. I plan to fix some of the jumpy transitions—I didn’t get a chance to fully QA every interaction, and invalidating data on TanStack's React Query (the client for tRPC) is a bit new to me, so with more time, I would polish this part further.

### Image Handling and Optimization

Basic image optimization is implemented using a canvas element to convert images to the **WebP** format and apply basic lossy optimization via `canvas.toBlob`. This ensures optimal space usage by resizing images appropriately. Additionally, the app deletes old images when a memory is updated or deleted, maintaining efficient storage practices.

### Deployment

For deployment, I used **Neon** as the database and **Vercel Blob Storage** for image hosting. Having exhausted my free GCP credits, I opted for an all-Vercel setup, which has performed well so far.

### Product Future Improvements

The app could greatly benefit from a comprehensive redesign to establish a stronger visual identity. Due to time constraints, I wasn't able to create design concepts in Figma, so the current UI was developed through trial and error to find what worked best.

Currently, any user can edit another user's memories or lanes, as the only requirement for signing in is providing a username. Enhancing user authentication and access control would be a logical next step to improve security and user experience.

I chose not to implement multiple image uploads initially due to the added UI complexity (e.g., managing an array of images in a compact dialog, allowing users to reorder images, etc.). Additionally, handling potential issues like partial failures during batch uploads was outside the initial project scope. However, given more time, these features could be developed and integrated.

I would also want to implement infinite loading/pagination for all of the gridded views. While the current data set is manageable, as it grows, the app could struggle to perform efficiently if it attempts to load all data at once. Implementing infinite loading would ensure better performance and a smoother user experience by fetching and displaying data incrementally as the user scrolls. For now I've kept it optimistic as it's just an MVP.

Additional features such as enabling users to like a memory or lane, and showcasing highlighted lanes of the week on the homepage, are also potential enhancements to enrich user engagement.

### User Feedback

After deploying the application and receiving feedback from friends during user testing, the following potential improvements were noted:

1. The process of creating a memory lane and subsequently adding memories feels overly complex and should be simplified. A possible enhancement could be implementing an onboarding flow that allows users to create a lane and immediately add memories to it.

    > I later added ExifData package to automatically attempt to find the date the image was taken and autofill the timestamp hopefully improving the UX slightly
2. Users expressed a desire to use the app similarly to Instagram, wanting to create picture collections akin to albums without placing much importance on adding timestamps.
3. Users raised concerns about all memory lanes being public by default. They wanted the ability to keep some lanes private.

### Credits

Special thanks to **ChatGPT** for helping format this document and to **CoPilot** for assisting with the generation of various boilerplate code.

---

Again, you can explore the project at: [ervin-memorylane.vercel.app](https://ervin-memorylane.vercel.app)
