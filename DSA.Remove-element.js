// Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. 
// The order of the elements may be changed. Then return the number of elements in nums which are not equal to val.

// https://leetcode.com/problems/remove-element/description/?envType=study-plan-v2&envId=top-interview-150


var removeElement = function (nums, val) {
    let k = 0;

    for (let i = 0; i < nums.length; i++) {

        if (nums[i] !== val) {
            nums[k] = nums[i];
            k++;
        }
    }

    return k

};
