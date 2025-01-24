This is a [Next.js](https://nextjs.org) project with Supabase/Postgres and a hell lot of Tailwind CSS for just one screen, that it can even blow away an Aircraft carrier.

<img width="1532" alt="image" src="https://github.com/user-attachments/assets/04c66872-a45a-42e0-9a47-3466ad206cb9" />


## Getting Started
First, add the environment variables in your root directory; it must contain:
  _ SUPABASE_URL
  _ SUPABASE_ANON_KEY

Second, run the development server:
```bash
npm run dev
```

Third, go to the kitchen, take a mojito, and ENJOY!!!


## Directory Structure
### The files in italic are the ones which we need to create/modify in irder to make the application run.
<img alt="image" src="https://github.com/nehalpatil7/spur-test-scheduler/blob/main/hierarchy.png" />


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Learn More
Checkout the live version deployed for a few days on [Vercel Platform](https://spur-test-scheduler-jmso.vercel.app/) (built by the creators of Next.js).


## Here's the demo of the app if anyone wants to check out.
[VIDEO_DEMO_LINK](https://www.loom.com/share/fa939c56dbf34157a21cdb83f96879af?sid=11f2fe8c-c804-4797-b528-5e66759ac1e4)


## Sanity Checks Performed for the Functionality
* Calendar Component
1. Rendering Calendar:
  - Verified that the calendar displays correctly for the current week.
  - Ensured navigation buttons (Next and Previous) update the week correctly.
2. Test Scheduling:
  - Confirmed that clicking the "Schedule Test" button opens the ScheduleTestModal.
  - Validated that the modal allows selecting a test suite, start time, and cadence.
  - Ensured the "Save Changes" button in the modal saves the new schedule and refreshes the calendar view dynamically.
3. Rendering Scheduled Tests:
  - Verified that scheduled tests are displayed in their respective time slots.
  - Confirmed that the displayed test_suite_name and start_time match the database values.
  - Checked the UI responsiveness for test frames on smaller screens.

* Backend Integration
Verified that a PUT request is sent to the /api/schedules/[id] endpoint with the updated start_time when a frame is dropped.
1. API Functionality
  - Confirmed that /api/schedules fetches all schedules correctly on page load.
  - Verified that test schedules are dynamically refreshed after adding or editing a schedule.
2. Schedule Update:
  - Ensured that /api/schedules/[id] updates the corresponding schedule when a PUT request is made.
  - Validated that the backend responds with a 200 OK status and updated data.
3. Error Handling:
  - Tested invalid cases like missing fields in the request body or non-existent id values.
  - Verified that appropriate error messages (e.g., 404 Not Found or 400 Bad Request) are displayed when applicable.

* Authentication
1. Login Wrapper:
  - Verified that unauthenticated users see a login screen and cannot access the calendar.
  - Confirmed that authenticated users can see their schedules after logging in.
  - Checked the functionality of the profile button for logging in and out.

* General UX & Validation
1. Modal Validation:
  - Ensured that required fields in both ScheduleTestModal and EditScheduleModal are validated before saving.
  - Verified that overlapping schedules are prevented based on the validation logic.
2. Performance:
  - Checked that the app remains responsive even with multiple schedules loaded.
  - Ensured no unnecessary API calls are made during navigation or edits.
3. Visual Consistency:
  - Verified that all components follow the design provided in the Figma file.
  - Ensured that modals, buttons, and input fields are styled correctly.

*Bonus Checks
1. Pagination (List View):
  - Confirmed that the list view paginates correctly for large datasets.
  - Checked navigation between pages using "Next" and "Previous" buttons.
2. Deployment:
  - Verified deployment to Vercel with environment variables correctly set (e.g., Supabase URL and key).
  - Tested the app in production for functionality and responsiveness.


Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
