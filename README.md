### Employee Dashboard with Realtime Firebase Integration

### Description

This project is an Employee Dashboard built using **React.js** and **Firebase**. It allows users to manage employees and their associated categories in real-time. The application leverages Firebase’s Firestore for storing employee data and Firebase Realtime Database for managing and displaying categories assigned to each employee. The dashboard features real-time updates using Firebase snapshots, which ensure the UI is always in sync with the latest data.

The app is deployed as SPA to firebase [here](https://userdata-dashboard-58614.firebaseapp.com/).

### Tech Stack

- **React.js**: A popular JavaScript library for building user interfaces.
- **Firebase**:
  - **Firestore**: A scalable, flexible database for storing and syncing employee data.
  - **Realtime Database**: Used for managing categories, allowing real-time updates and syncing across clients.
- **Chart.js**: A versatile charting library used to visualize the data in the dashboard, providing an overview of categories assigned to each employee.
- **Bootstrap**: A CSS framework used for responsive design and UI components.
- **Colormap**: A JavaScript library used for generating color palettes for the charts.

### Key Features

- **Real-time Data Synchronization**: The application uses Firebase snapshots to keep the UI updated with the latest data without requiring a manual refresh. Any changes in the employee data or their categories are immediately reflected in the UI.
  
- **Employee Management**: Users can add, update, and delete employees. The application leverages Firestore's snapshot listeners to ensure that the employee list is always up to date.

- **Category Management**: Categories can be assigned to employees and managed in real-time using Firebase Realtime Database. The UI updates automatically when categories are added or removed, thanks to the on-value listeners.

- **Data Visualization**: The dashboard includes a bar chart visualizing the number of categories assigned to each employee, making it easy to assess and manage employee workloads.

### Installation

1. **Clone the repository**:

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Add your Firebase configuration to `firebase-config.js`.
   - Ensure Firestore and Realtime Database are set up in your Firebase project.

4. **Run the application**:
   ```bash
   npm run dev
   ```

### Usage

- **Add Employee**: Input the employee's name and marks, then click "Create Employee."
- **Manage Categories**: Assign categories to employees and manage them in real-time. Use the UI to add, update, or delete categories.
- **Visualize Data**: The dashboard provides a bar chart visualizing the number of categories assigned to each employee.

### Acknowledgments

This project was inspired and partly guided by the blog post ["Google Firebase and ReactJS Integration"](https://medium.com/@sanchit0496/google-firebase-and-reactjs-integration-74855ec024ec) by Sanchit Sharma.
