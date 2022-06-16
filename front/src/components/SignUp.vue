<template>
  <img
    class="mb-4"
    src="../assets/icon-above-font.png"
    alt=""
    width="300"
    height="200"
  />
  <div class="card">
     <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin" class="rounded-circle" width="50">
    <div class="card-body">
      <div class="row mb-3">
        <div class="col-sm-3"><h6 class="mb-0">Full Name</h6></div>
        <div class="col-sm-9 text-secondary">
          <input type="text" class="form-control" value="John Doe" />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-sm-3"><h6 class="mb-0">Email</h6></div>
        <div class="col-sm-9 text-secondary">
          <input type="text" class="form-control" value="john@example.com" />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-sm-3"><h6 class="mb-0">Phone</h6></div>
        <div class="col-sm-9 text-secondary">
          <input type="text" class="form-control" value="(239) 816-9029" />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-sm-3"><h6 class="mb-0">Mobile</h6></div>
        <div class="col-sm-9 text-secondary">
          <input type="text" class="form-control" value="(320) 380-4539" />
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-sm-3"><h6 class="mb-0">Address</h6></div>
        <div class="col-sm-9 text-secondary">
          <input
            type="text"
            class="form-control"
            value="Bay Area, San Francisco, CA"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-3"></div>
        <div class="col-sm-9 text-secondary">
          <input
            type="button"
            class="btn btn-primary px-4"
            value="S'inscrire"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignUpVue",
};
</script>

<style>

</style>
