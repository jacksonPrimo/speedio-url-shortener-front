import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LoadBar from "./loadBar.vue";

describe("LoadBar", () => {
  const wrapper = mount(LoadBar);
  it("should show progress bar", async () => {
    expect(wrapper.find('[data-test-id]="load-bar"').exists()).toBeFalsy();
    wrapper.setData({
      inProgress: true,
    });
    expect(wrapper.find('[data-test-id]="load-bar"').exists()).toBeFalsy();
  });

  it("should update progress bar on init", async () => {
    expect(wrapper.vm.progress).toBe(0.0);
    wrapper.vm.init();
    await new Promise(function (resolve) {
      setTimeout(resolve, 1000);
    });
    expect(wrapper.vm.progress > 0.0).toBe(true);

    wrapper.vm.fail();
    wrapper.vm.reset();
  });
  it("should change color bar to red when fail", async () => {
    expect(wrapper.vm.progress).toBe(0.0);
    wrapper.vm.init();
    await new Promise(function (resolve) {
      setTimeout(resolve, 1000);
    });
    wrapper.vm.fail();
    expect(wrapper.find(".q-linear-progress.text-primary").exists()).toBe(true);
    wrapper.vm.reset();
  });
  it("should change color bar to green when success", async () => {
    expect(wrapper.vm.progress).toBe(0.0);
    wrapper.vm.init();
    await new Promise(function (resolve) {
      setTimeout(resolve, 1000);
    });
    wrapper.vm.success();
    expect(wrapper.find(".q-linear-progress.text-primary").exists()).toBe(true);
    wrapper.vm.reset();
  });
});
