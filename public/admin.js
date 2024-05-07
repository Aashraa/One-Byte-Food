// SIDEBAR TOGGLE

let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var dashboardButton = document.getElementById("dashboardButton");
  dashboardButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action of the link
    location.reload(); // Reload the current page
  });
});

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

