package com.example.taxi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.taxi.dto.response.CurrentUserResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MeRestControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void me_returnsAdminProfileWhenAuthenticated() throws Exception {
        String body = mockMvc.perform(get("/api/me").with(httpBasic("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"))
                .andExpect(jsonPath("$.enabled").value(true))
                .andReturn().getResponse().getContentAsString();

        CurrentUserResponse user = objectMapper.readValue(body, CurrentUserResponse.class);
        assertThat(user.username()).isEqualTo("admin");
        assertThat(user.role()).isEqualTo("ROLE_ADMIN");
    }

    @Test
    void me_returnsProfileWithRoleOfEachDemoAccount() throws Exception {
        mockMvc.perform(get("/api/me").with(httpBasic("operator", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("operator"))
                .andExpect(jsonPath("$.role").value("ROLE_OPERATOR"));
    }

    @Test
    void me_isForbiddenWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/me"))
                .andExpect(status().isUnauthorized());
    }
}
