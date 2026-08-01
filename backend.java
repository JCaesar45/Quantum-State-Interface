package com.quantum.transaction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicLong;

@SpringBootApplication
@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TransactionServiceApplication.class, args);
    }

    private final TransactionProcessor processor;

    public TransactionServiceApplication(TransactionProcessor processor) {
        this.processor = processor;
    }

    @PostMapping("/execute")
    public TransactionResult executeTransaction(@RequestBody TransactionRequest request) {
        return processor.process(request);
    }
}

@Service
class TransactionProcessor {
    private final AtomicLong transactionCounter = new AtomicLong(0);

    public TransactionResult process(TransactionRequest request) {
        // CPU-bound validation and processing logic
        validateRequest(request);
        long txId = transactionCounter.incrementAndGet();
        
        // Simulate processing time
        try { Thread.sleep(5); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        
        return new TransactionResult(txId, "COMMITTED", request.getAmount());
    }

    private void validateRequest(TransactionRequest request) {
        if (request.getAmount() <= 0) {
            throw new IllegalArgumentException("Transaction amount must be positive");
        }
    }
}

class TransactionRequest {
    private String accountId;
    private double amount;

    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) { this.accountId = accountId; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}

class TransactionResult {
    private long transactionId;
    private String status;
    private double processedAmount;

    public TransactionResult(long transactionId, String status, double processedAmount) {
        this.transactionId = transactionId;
        this.status = status;
        this.processedAmount = processedAmount;
    }

    public long getTransactionId() { return transactionId; }
    public String getStatus() { return status; }
    public double getProcessedAmount() { return processedAmount; }
}
