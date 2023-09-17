import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Box, Flex, Button, FormControl, FormLabel, Input, Textarea, VStack, FormErrorMessage, useToast, Heading } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // ここに送信処理を書く（例: APIエンドポイントへのPOSTリクエスト）
      console.log(data);

      toast({
        title: "Message sent successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      toast({
        title: "Failed to send message.",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <Box>
            <Heading as="h2" fontSize="2xl" fontWeight="900" mb={6}>
                /Contact
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4} width="100%">
                <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" {...register("email", { required: "Email is required", pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/, message: "Invalid email address" } })} placeholder="Your Email" bg="white" color="gray.800" />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.message}>
                    <FormLabel htmlFor="message">Message</FormLabel>
                    <Textarea id="message" {...register("message", { required: "Message is required" })} placeholder="Your Message" bg="white" color="gray.800" />
                    <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
                </FormControl>
                <Button
                    p={5}
                    isLoading={isLoading}
                    fontWeight="600"
                    borderRadius="25px"
                    bg="#664D03"
                    color="#EDDFD6"
                    boxShadow="2px 2px 10px rgb(5, 48, 176, 0.3)"
                    _hover={{ opacity: 0.7 }}
                >
                Send Message
                </Button>
                </VStack>
            </form>
        </Box>
  );
};

export default ContactForm;
