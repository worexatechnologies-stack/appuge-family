cmake_minimum_required(VERSION 3.13)

project(appmodules)

include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

if(TARGET react_codegen_safeareacontext)
    target_link_libraries(react_codegen_safeareacontext c++_shared)
endif()
